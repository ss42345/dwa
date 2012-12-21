<?php

class stocks_controller extends base_controller {

	public function __construct() {
		parent::__construct();
		
		# Make sure user is logged in if they want to use anything in this controller
		if(!isset($this->user)) {
			$message = "Members only. Please <a href='/users/login'>login</a>";
			#die($message);
			#return false;
			
			# Reset the view
			$this->template->content = View::instance('v_index_index');
			$this->template->title   = "Message";

			# Set the message
			$this->template->content->message = $message;
			
			# Render view
			echo $this->template;
			
			die();
		}
		
	}
	
	public function add() {
	
		# Setup view
		$this->template->content = View::instance('v_stocks_add');
		$this->template->title   = "Add new stock to the watchlist";

        # If this view needs any JS or CSS files, add their paths to this array so they will get loaded in the head
        $client_files = Array(
            "/js/jquery-1.8.3.min.js",
            "/js/jsapi.js",
            "/js/stockfunctions.js",
            "/js/stockcharts.js",
        );

        $this->template->client_files = Utils::load_client_files($client_files);

        # Render template
		echo $this->template;
	}

    public function p_add() {
        # Search the database for the stock
        $q = "SELECT *
					 FROM stocks
					 WHERE stock = '".$_POST['stock']."'
					 AND stocks.user_id = ".$this->user->user_id;

        $stock = DB::instance(DB_NAME)->select_field($q);

        # Check if we found the stock => update it.
        if (!$stock) {
            # Associate this stock with this user
            $_POST['user_id']  = $this->user->user_id;

            # Unix timestamp of when this post was created / modified
            $_POST['created']  = Time::now();
            $_POST['modified'] = Time::now();

            # Insert
            # Note we didn't have to sanitize any of the $_POST data because we're using the insert method which does it for us
            DB::instance(DB_NAME)->insert('stocks', $_POST);
        }
        else {
            $q2 = "UPDATE stocks
                        SET DataPeriod = '".$_POST['DataPeriod']."',
                        SMAPeriod  = ".$_POST['SMAPeriod'].",
                        EMAPeriod  = ".$_POST['EMAPeriod'].",
                        StochasticPeriod1 = ".$_POST['StochasticPeriod1'].",
                        StochasticPeriod2 = ".$_POST['StochasticPeriod2']."
                   ";

            DB::instance(DB_NAME)->query($q2);
        }

        # Send them back
        Router::redirect("/stocks/mystocks");
    }

    public function remove() {
        # Setup view
        $this->template->content = View::instance('v_stocks_remove');
        $this->template->title   = "Remove Stocks from Watchlist";

        # Build the query
        $q = "SELECT *
			 FROM stocks
			 WHERE stocks.user_id = ".$this->user->user_id;

        # Run the query
        $mystocks = DB::instance(DB_NAME)->select_rows($q);

        # Pass the data to the view
        $this->template->content->mystocks = $mystocks;

        # Render template
        echo $this->template;
    }

    /**
    public function remove_stock($stock_id_to_remove) {

        # Delete this connection
        $where_condition = 'WHERE user_id = '.$this->user->user_id.' AND stock_id = '.$stock_id_to_remove;
        DB::instance(DB_NAME)->delete('stocks', $where_condition);

        # Send them back
        Router::redirect("/stocks/mystocks");
    }
    **/

    public function p_remove() {

        $where_condition = "WHERE stocks.user_id = ".$this->user->user_id." AND (";
        if (isset($_POST['remove_stocks'])) {
            foreach ($_POST['remove_stocks'] as $remstock) {
                $where_condition .= " stock = '".$remstock."' OR";
            }
        }

        # Remove the final OR and add a closing parenthesis
        $where_condition = substr($where_condition, 0, -3);
        $where_condition = $where_condition.")";

        DB::instance(DB_NAME)->delete('stocks', $where_condition);

        # Send them back
        Router::redirect("/stocks/remove");
    }

    public function mystocks() {

        # Set up view
        $this->template->content = View::instance('v_stocks_mystocks');
        $this->template->title   = "My Stocks";

        # Build a query to grab stocks from the user who is logged in
        $q = "SELECT *
			 FROM stocks
			 WHERE stocks.user_id = ".$this->user->user_id;

        # Run the query, store the results in the variable $mystocks
        $mystocks = DB::instance(DB_NAME)->select_rows($q);

        # Pass data to the view
        $this->template->content->mystocks = $mystocks;

        # Render view
        echo $this->template;

    }

    public function getstockdata() {
        // Get from Yahoo
        $url = 'http://ichart.finance.yahoo.com/table.csv?s=MSFT&d=11&e=19&f=2012&g=d&a=11&b=1&c=2012&ignore=.csv';
        $results = Utils::curl($url);
        //$results = array_map("str_getcsv", preg_split('/\r*\n+|\r+/', $results));
        $jsArray = json_encode($results);

        # Debug the results
        #echo Debug::dump($results,"");
        #var_dump($results);
        print_r($jsArray);
    }


    /*** Not needed ***
	public function users() {

		# Set up the view
		$this->template->content = View::instance("v_posts_users");
		$this->template->title   = "Users";
	
		# Build our query to get all the users
		$q = "SELECT *
			  FROM users";
		
		# Execute the query to get all the users. Store the result array in the variable $users
		$users = DB::instance(DB_NAME)->select_rows($q);
	
		# Build our query to figure out what connections does this user already have? I.e. who are they following
		$q = "SELECT * 
			  FROM users_users
			  WHERE user_id = ".$this->user->user_id;
		
		# Execute this query with the select_array method
		# select_array will return our results in an array and use the "users_id_followed" field as the index.
		# This will come in handy when we get to the view
		# Store our results (an array) in the variable $connections
		$connections = DB::instance(DB_NAME)->select_array($q, 'user_id_followed');
			
		# Pass data (users and connections) to the view
		$this->template->content->users       = $users;
		$this->template->content->connections = $connections;

		# Render the view
		echo $this->template;
	}

	public function follow($user_id_followed) {
		
		# Prepare our data array to be inserted
		$data = Array(
			"created" => Time::now(),
			"user_id" => $this->user->user_id,
			"user_id_followed" => $user_id_followed
			);
	
		# Do the insert
		DB::instance(DB_NAME)->insert('users_users', $data);

		# Send them back
		Router::redirect("/posts/users");
	}

	public function unfollow($user_id_followed) {

		# Delete this connection
		$where_condition = 'WHERE user_id = '.$this->user->user_id.' AND user_id_followed = '.$user_id_followed;
		DB::instance(DB_NAME)->delete('users_users', $where_condition);
	
		# Send them back
		Router::redirect("/posts/users");
	}

	public function index() {

		# Set up view
		$this->template->content = View::instance('v_posts_index');
		$this->template->title   = "Posts";
	
		# Build a query of the users this user is following - we're only interested in their posts
		$q = "SELECT * 
			  FROM users_users
			  WHERE user_id = ".$this->user->user_id;
	
		# Execute our query, storing the results in a variable $connections
		$connections = DB::instance(DB_NAME)->select_rows($q);
	
		# In order to query for the posts we need, we're going to need a string of user id's, separated by commas
		# To create this, loop through our connections array
		$connections_string = "";
		foreach($connections as $connection) {
			$connections_string .= $connection['user_id_followed'].",";
		}
	
		# Remove the final comma 
		$connections_string = substr($connections_string, 0, -1);

		if(!$connections_string) {
			# Reset the view
			$this->template->content = View::instance('v_index_index');
			$this->template->title   = "Message";

			# Set the message
			$this->template->content->message = $this->user->first_name.", you are not following anyone yet.";
			
			# Render view
			echo $this->template;	
		}
		else {
			# Build our query to grab the posts
			$q = "SELECT * 
				 FROM posts 
				 JOIN users USING (user_id)
				 WHERE posts.user_id IN (".$connections_string.")"; # This is where we use that string of user_ids we created
				
			# Run our query, store the results in the variable $posts
			$posts = DB::instance(DB_NAME)->select_rows($q);
	
			# Pass data to the view
			$this->template->content->posts = $posts;
	
			# Render view
			echo $this->template;
		}
	}
     ****/
}
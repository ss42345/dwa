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

    public function getstockdata($stockStringIn) {

        print_r($stockStringIn);

        // Get from Yahoo
        //$url = 'http://ichart.finance.yahoo.com/table.csv?s=MSFT&d=11&e=19&f=2012&g=d&a=11&b=1&c=2012&ignore=.csv';
        $urlString = "http://ichart.finance.yahoo.com/table.csv?".$stockStringIn;

        $results = Utils::curl($urlString);
        //$results = array_map("str_getcsv", preg_split('/\r*\n+|\r+/', $results));
        $jsArray = json_encode($results);

        # Debug the results
        #echo Debug::dump($results,"");
        #var_dump($results);
        print_r($jsArray);
    }
}
<?php
class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
		# echo "users_controller construct called<br><br>";
	} 
	
	public function index() {
		# echo "Welcome to the users's department";
	}
	
	public function signup() {
		# echo "This is the signup page";
	
		# Setup view
			$this->template->content = View::instance('v_users_signup');
			$this->template->title   = "Signup";
			
		# Render template
			echo $this->template;		
		}
	
	public function login($error = NULL) {
		# Setup view
			$this->template->content = View::instance('v_users_login');
			$this->template->title = "Login";
		
		# Pass data to the view
			$this->template->content->error = $error;
			
		# Render template
			echo $this->template;
		
	}
	
	public function logout() {
		# Generate and save a new token for next login
		$new_token = sha1(TOKEN_SALT.$this->user->email.Utils::generate_random_string());

		# Create the data array we'll use with the update method
		# In this case, we're only updating one field, so our array only has one entry
		$data = Array("token" => $new_token);
	
		# Do the update
		DB::instance(DB_NAME)->update("users", $data, "WHERE token = '".$this->user->token."'");
	
		# Delete their token cookie - effectively logging them out
		setcookie("token", "", strtotime('-1 year'), '/');
	
		# Send them back to the main landing page
		Router::redirect("/");
	}

	public function profile() {
		
		if (!$this->user) {
			# Send them back to the main landing page
			Router::redirect("/");
	
			# Return
			return false;
		}
		 
		# Setup view
		$this->template->content = View::instance('v_users_profile');
		$this->template->title = "Profile of ".$this->user->first_name;
		 
		# Render template
		echo $this->template;		 
	}
	
	public function showall() {

		# Show all users
		if (!$this->user) {
			# Send them back to the main landing page
			Router::redirect("/");
	
			# Return
			return false;
		}

		# Setup view
		$this->template->content = View::instance('v_users_showall');
		$this->template->title = "All users";
		 
		# Build a query of all the users 
		$q = "SELECT * 
			  FROM users";
	
		# Execute our query, storing the results in a variable $connections
		$allusers = DB::instance(DB_NAME)->select_rows($q);
		 
		# Pass the data to the view
		$this->template->content->allusers = $allusers;

		# Render template
		echo $this->template;		 	
	}
	
	public function p_signup() {

		# Encrypt the password
		$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
		
		# Time specific data 
		$_POST['created'] = Time::now();
		$_POST['modified'] = Time::now();
		
		# Token
		$_POST['token'] = sha1(TOKEN_SALT.$_POST['email'].Utils::generate_random_string());

        # Insert this user into the database
		$user_id = DB::instance(DB_NAME)->insert("users", $_POST);
	
		# For now, just confirm they've signed up - we can make this fancier later
		echo "You're signed up";

		# Send them to the main page
		Router::redirect("/");
		
		
	}	
	public function p_login() {

		# Sanitize any user input
		$_POST = DB::instance(DB_NAME)->sanitize($_POST);
	
		# Encrypt the submitted password
		$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
		
		# Search the DB for this email and password
		# Get the token if it is available
		$q = "SELECT token
					 FROM users
					 WHERE email = '".$_POST['email']."'
					 AND password = '".$_POST['password']."'
			 ";
		$token = DB::instance(DB_NAME)->select_field($q);
		
		# Check if we found the token. If not => login failed
		if (!$token) {
			#echo 'Login failed';
			
			# Send them back to the login page
			Router::redirect("/users/login/error");
		}
		else {
			# Login succeeded
			# Store this token in a cookie
			@setcookie("token", $token, strtotime('+1 year'), '/');
			
			#echo Debug::dump($_POST,"Contents of POST");
			
			# Send them to the main page
			Router::redirect("/users/profile");
		}			
	}
			
} # end of the class
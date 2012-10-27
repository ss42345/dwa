<?php
class users_controller extends base_controller {

	public function __construct() {
		parent::__construct();
		echo "users_controller construct called<br><br>";
	} 
	
	public function index() {
		echo "Welcome to the users's department";
	}
	
	public function signup() {
		echo "This is the signup page";
	
		# Setup view
			$this->template->content = View::instance('v_users_signup');
			$this->template->title   = "Signup";
			
		# Render template
			echo $this->template;		
		}
	
	public function login() {
		# Setup view
			$this->template->content = View::instance('v_users_login');
			$this->template->title = "Login";
		
		# Render template
			echo $this->template;
	}
	
	public function logout() {
		echo "This is the logout page";
	}

	public function profile($user_name = NULL) {
		
		if($user_name == NULL) {
			echo "No user specified";
		}
		else {
			echo "This is the profile for ".$user_name;
		}
		
		#Setup view
		$this->template->content = View::instance('v_users_profile');
		$this->template->title = "Profile";

		# Load CSS / JS
		$client_files = Array(
					"/css/users.css",
					"/js/users.js",
	            	);	
        $this->template->client_files = Utils::load_client_files($client_files);   

		
		#Pass information to the view
		$this->template->content->user_name = $user_name;
		
		#Render template
		echo $this->template;
		
		

		
	}
	public function p_signup() {
		
		# Encrypt the password
		$_POST['password'] = sha1(PASSWORD_SALT.$_POST['password']);
		
		# Time specific data 
		$_POST['created'] = Time::now();
		$_POST['modified'] = Time::now();
		
		# Token
		$_POST['token'] = sha1(TOKEN_SALT.$POST['email'].Utils::generate_random_string());
		
		# Insert this user into the database
		$user_id = DB::instance(DB_NAME)->insert("users", $_POST);
	
		# For now, just confirm they've signed up - we can make this fancier later
		echo "You're signed up";	
		
	}	
	public function p_login() {
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
			echo 'Login failed';
			
			# Send them back to the login page
			Router::redirect("/users/login");
		}
		else {
			# Login succeeded
			echo 'Login succeeded';
			
			# Store this token in a cookie
			@setcookie("token", $new_token, strtotime('+1 year'), '/');
			
			# Send them to the main page
			Router::redirect("/");
		}
		
	}
		
} # end of the class
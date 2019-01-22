package com.example.webdevserverjava.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Random;

import com.example.webdevserverjava.model.User;

@RestController
public class UserService {

	List<User> users = new ArrayList<User>();
	User alice = new User(123, "alice", "pw", "Alice", "Wonderland", "Faculty");
	User bob   = new User(234, "bob", "pw", "Bob", "Marley", "Student");
	User steve = new User(456, "steve", "pw", "Steve", "Smith", "Admin");
	Boolean initialized = false;
	List<Integer> idList = new ArrayList<Integer>();
	
	public void initialize () {
		users.add(alice);
		users.add(bob);
		users.add(steve);
		idList.add(123);
		idList.add(234);
		idList.add(456);
	}
	
;	
	@GetMapping("/api/user")
	public List<User> findAllUser() {
		if (! this.initialized) {
			initialize();
			this.initialized = true;
		}
		System.out.println("From the getALlUsers API call");
		printUserData();
		return users;
	}
	@GetMapping("/api/user/{userId}")
	public User findUserById(
			@PathVariable("userId") Integer id) {
		for(User user: users) {
			if(id == user.getId().intValue()) {
				System.out.println("got it from the findUserById method " + user.getFirstName());
				return user;
		}
			System.out.println("From Update API call");
			printUserData();
		}
		System.out.println("Could not find user");
		return null;
	}
	
	
	@RequestMapping(value="/createUser/{username}/{password}/{firstName}/{lastName}/{role}", method=RequestMethod.POST)
	public User createUser(@PathVariable(value="username") String userName,
			@PathVariable("firstName") String firstName,
			@PathVariable("lastName") String lastName,
			@PathVariable("password") String password,
			@PathVariable("role") String role) {
		int id = generateID();
		User newUser = new User (id, userName, password, firstName, lastName, role);
		System.out.println(newUser.getFirstName());
		users.add(newUser);
		System.out.println("There are now" + users.size() +" users");
		return newUser;
		
	} 
	
	@GetMapping("/api/recent")
	public User returnMostRecentUser () {
		User recent = users.get(users.size()-1);
		System.out.println("From the recent user API call");
		printUserData();
		return recent;
	}
	
	@RequestMapping(value="/deleteUser/{id}", method=RequestMethod.POST)
	public void deleteUser(@PathVariable(value="id") int id) {
		int i = 0;
		for (User u : users) {
			if (u.getId() == id) {
				users.remove(i);
				System.out.println(users);
				return;
			}
			i++;
		}
		System.out.println("User was not found");
	}
	@RequestMapping(value="/updateUser/{username}/{password}/{firstName}/{lastName}/{userId}/{role}", method=RequestMethod.POST)
	public void createReplacementUser(@PathVariable(value="username") String userName,
			@PathVariable("firstName") String firstName,
			@PathVariable("lastName") String lastName,
			@PathVariable("password") String password,
			@PathVariable("userId") Integer userId,
			@PathVariable("role") String role) {
		User updatedUser = new User(userId,userName,password,firstName,lastName, role);
		System.out.println("The usernmae of the updated user is: " + updatedUser.getUsername());
		updateUser(userId, updatedUser);
	}
	
	public void updateUser(Integer id, User updatedUser) {
		System.out.println("The id of the user to be updated is: " + id);
		for (User u : users) {
			if (u.getId().intValue() == id.intValue()) {
				u.setUsername(updatedUser.getUsername());
				u.setPassword(updatedUser.getPassword());
				u.setFirstName(updatedUser.getFirstName());
				u.setLastName(updatedUser.getLastName());
				u.setRole(updatedUser.getRole());
				System.out.println("User updated successfully");
				for (User us : users) {
					System.out.println(us.getUsername());
				}
				return;
			}
		}
		System.out.println("Unable to find the user to update");
		
		}
	
	
	public int generateID () {
		Boolean numberGenerated = false;
		int attempt = 0;
		while (! numberGenerated) {
			Random rand = new Random();
			attempt = rand.nextInt(999) + 1;
			if (! idList.contains(attempt)) {
				numberGenerated = true;
				idList.add(attempt);
			}
		}
		return attempt;
	}
	
	public static void main (String [] args) {

	}
	
	public void printUserData() {
		int i=0;
		for (User u : users) {
			System.out.println("User "+i);
			System.out.println("ID: " + u.getId());
			System.out.println("Username0: " + u.getUsername());
			System.out.println("First Name: " + u.getFirstName());
			System.out.println("Last Name: " + u.getLastName());
			System.out.println("Password: " + u.getPassword());
			System.out.println("Role: " + u.getRole());
			System.out.println("");
			i++;
		}
	}
}


(function(){
    var $usernameFld, $passwordFld;
    var $removeBtn, $editBtn, $createBtn;
    var $firstNameFld, $lastNameFld;
    var $userRowTemplate, $tbody;
    var userService = new AdminUserServiceClient();
    
    $(main);
    
    function main() {
    	
        $usernameFld = $("#usernameFld");
        $passwordFld = $("#passwordFld");
        $firstNameFld = $("#firstNameFld");
        $lastNameFld = $("#lastNameFld");
        $roleFld = $("#roleFld");
        $userRowTemplate = $(".wbdv-template");
        $tbody = $("tbody");
        $usernameFld.val("alice");
        userService
            .findAllUsers()
            .then(renderUsers);

        //Event handlers
  	  $(document).on("click", ".wbdv-delete-button", function() {
  		  console.log("clicked");
  		  var rowId = getUserIdFromButton($(this));
  		  deleteUser(rowId);
  		  });
  	  $(document).on("click", "#createBtn", function(){
  		 var username = $("#usernameFld").val();
  		 var password = $("#passwordFld").val();
  		 var firstName = $("#firstNameFld").val();
  		 var lastName = $("#lastNameFld").val();
  		 var role = $("#roleFld :selected").text();
  		 console.log("role: " + username);
  		 createUser(username, password,firstName,lastName,role);
  	  });
  	$(document).on("click", ".wbdv-update-button", function() {
		  var rowId = getUserIdFromButton($(this));
		  console.log("The row ID is: " + rowId);
		  return findUserById(rowId).then(function(user){
			  console.log("The returned user is: " + user.username);
			  selectUser(user);
		  });
		  });
  	$(document).on("click", "#updateBtn", function(){
  		console.log("clicked button to save update");
  		var userId = $("#usernameFld").attr("data-userId");
  		 var username = $("#usernameFld").val();
  		 var password = $("#passwordFld").val();
  		 var firstName = $("#firstNameFld").val();
  		 var lastName = $("#lastNameFld").val();
  		 var role = $("#roleFld").val();
  		 updateUser(userId, username, password, firstName, lastName,role);
  	});
  	$(document).on("click", "#wbdv-search-button", function(){
  		 var username = $("#usernameFld").val();
  		 var password = $("#passwordFld").val();
  		 var firstName = $("#firstNameFld").val();
  		 var lastName = $("#lastNameFld").val();
  		 var role = $("#roleFld :selected").text();
  		 search(username, password, firstName, lastName,role);
  	});
  	      
  	function search(username, password, firstName, lastName, role){
  		
  		return userService.search(username, password, firstName, lastName, role).then(function(response){
  		$(".wbdv-template").remove();
  		renderUsers(response);
  		});
  	}
       
    
    function getUserIdFromButton(button){
    	var rowId = button.closest('tr').attr('id');
    	console.log("ID for row is: " + rowId);
    	return rowId;
    }
    function createUser(username, password, firstName, lastName, role) {
    	var newUser = new User (username, password, firstName, lastName, role);
    	userService.createUser(username, password, firstName, lastName, role);
    	
    	return userService.getMostRecentUser().then(function(response)
    	{
    		renderUser(response);
    	});
    }
    
    function findAllUsers() {
    	userService.findAllUsers()
    }
    function findUserById(userId) {  
    	return userService.findUserById(userId);
    }
    function deleteUser(userId) {
    	var deleteText = '#'.concat(userId);
    	var userToDelete = $(deleteText);
    	console.log(userToDelete);
    	userService.deleteUser(userId);
    	userToDelete.remove();
    }
    function selectUser(user) {
    	console.log(user.username);
    	$("#usernameFld").val(user.username);
    	$("#passwordFld").val(user.password);
    	$("#firstNameFld").val(user.firstName);
    	$("#lastNameFld").val(user.lastName);
    	$("#roleFld").val(user.role);
    	$("#usernameFld").attr("data-userId",user.id);
    }
    function updateUser(userId, username, password, firstName, lastName, role) {
    	var updatedUser = new User(username, password, firstName, lastName, role);
    	updatedUser.setId(userId);
    	userService.updateUser(updatedUser);
    	var updatedRowId = "#" + userId
    	$(updatedRowId).remove();
    	return findUserById(userId).then(function(response){
    		renderUser(response);
    	});
    	
    }
    
    function renderUser(user) { 
    	console.log(user);
        var clone = $userRowTemplate.clone();
        clone.attr("data-child-tag","child-tag");
        clone.find(".username").html(user.username);
        clone.find(".password").html(user.password);
        clone.find(".firstName").html(user.firstName);
        clone.find(".lastName").html(user.lastName);
        clone.find(".role").html(user.role)
        clone.attr("id",user.id);
        console.log(clone.id);
        $tbody.append(clone);
    }
    
    
    function renderUsers(users) {
        for(var u=0; u<users.length; u++) {
            console.log(users[u]);
            var clone = $userRowTemplate.clone();
            clone.find(".username").html(users[u].username);
            clone.find(".password").html(users[u].password);
            clone.find(".firstName").html(users[u].firstName);
            clone.find(".lastName").html(users[u].lastName);
            clone.find(".role").html(users[u].role)
            clone.attr("id",users[u].id);
            clone.attr("data-child-tag","child-tag");
            $tbody.append(clone);
        }
    }
    }
})();

$(document).ready(function(){
	  $('[data-toggle="tooltip"]').tooltip(); 
	});
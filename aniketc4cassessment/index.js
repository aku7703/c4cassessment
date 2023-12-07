window.onload = function () {
  // Firebase configuration for the web app
  var firebaseConfig = {
    apiKey: "AIzaSyCI2kAffa-39nC9_TTDG0qNmokJmiBwCzs",
    authDomain: "c4ctechassessment-aniketc.firebaseapp.com",
    projectId: "c4ctechassessment-aniketc",
    storageBucket: "c4ctechassessment-aniketc.appspot.com",
    messagingSenderId: "985492082917",
    appId: "1:985492082917:web:c0e41a4620d8dec627c40c",
  };

  // Initialize Firebase with the provided configuration
  firebase.initializeApp(firebaseConfig);

  // Database reference for Firebase
  var db = firebase.database();

  // Class definition for the anonymous chat application
  class AnonymousChat {
    // Method to create the home page
    home() {
      document.body.innerHTML = ""; // Clear the body before adding new content
      this.createTitle();
      this.createJoinForm();
    }

    // Method to create the chat page
    chat() {
      this.createTitle();
      this.createChat();
    }

    // Method to create the title element
    createTitle() {
      // Create a container for the title
      var titleContainer = document.createElement("div");
      titleContainer.setAttribute("id", "title_container");

      // Create an inner container for styling purposes
      var titleInnerContainer = document.createElement("div");
      titleInnerContainer.setAttribute("id", "title_inner_container");

      // Create the title element
      var title = document.createElement("h1");
      title.setAttribute("id", "title");
      title.textContent = "Code4Community Chat";

      // Append the elements to the DOM
      titleInnerContainer.append(title);
      titleContainer.append(titleInnerContainer);
      document.body.append(titleContainer);
    }

    // Method to create the join form
    createJoinForm() {
      // Reference to the current instance of the class
      var parent = this;

      // Create elements for join form
      var joinContainer = document.createElement("div");
      joinContainer.setAttribute("id", "join_container");

      var joinInnerContainer = document.createElement("div");
      joinInnerContainer.setAttribute("id", "join_inner_container");

      var joinButtonContainer = document.createElement("div");
      joinButtonContainer.setAttribute("id", "join_button_container");

      var joinButton = document.createElement("button");
      joinButton.setAttribute("id", "join_button");
      joinButton.innerHTML = 'Join <i class="fas fa-sign-in-alt"></i>';

      var joinInputContainer = document.createElement("div");
      joinInputContainer.setAttribute("id", "join_input_container");

      // Input element for user to enter their name
      var joinInput = document.createElement("input");
      joinInput.setAttribute("id", "join_input");
      joinInput.setAttribute("maxlength", 15);
      joinInput.placeholder = "Enter Name (Max 15 Characters)";

      // Add event listener to enable the join button when input is not empty
      joinInput.onkeyup = function () {
        if (joinInput.value.length > 0) {
          joinButton.classList.add("enabled");
          joinButton.onclick = function () {
            parent.saveName(joinInput.value);
            joinContainer.remove();
            parent.createChat();
          };
        } else {
          joinButton.classList.remove("enabled");
        }
      };

      // Append elements to the body
      joinButtonContainer.append(joinButton);
      joinInputContainer.append(joinInput);
      joinInnerContainer.append(joinInputContainer, joinButtonContainer);
      joinContainer.append(joinInnerContainer);
      document.body.append(joinContainer);
    }

    // Method to create a loading circle
    createLoad(containerId) {
      // Reference to the current instance of the class
      var parent = this;

      // Get the container element by ID
      var container = document.getElementById(containerId);
      container.innerHTML = "";

      // Create a container for the loader
      var loaderContainer = document.createElement("div");
      loaderContainer.setAttribute("class", "loader_container");

      // Create the loader element
      var loader = document.createElement("div");
      loader.setAttribute("class", "loader");

      // Append loader to the container
      loaderContainer.append(loader);
      container.append(loaderContainer);
    }

    // Method to create the chat container
    createChat() {
      // Reference to the current instance of the class
      var parent = this;

      // Get elements related to the title for styling adjustments
      var titleContainer = document.getElementById("title_container");
      var title = document.getElementById("title");
      titleContainer.classList.add("chat_title_container");
      title.classList.add("chat_title");

      // Create elements for the chat container
      var chatContainer = document.createElement("div");
      chatContainer.setAttribute("id", "chat_container");

      var chatInnerContainer = document.createElement("div");
      chatInnerContainer.setAttribute("id", "chat_inner_container");

      var chatContentContainer = document.createElement("div");
      chatContentContainer.setAttribute("id", "chat_content_container");

      var chatInputContainer = document.createElement("div");
      chatInputContainer.setAttribute("id", "chat_input_container");

      var chatInputSend = document.createElement("button");
      chatInputSend.setAttribute("id", "chat_input_send");
      chatInputSend.setAttribute("disabled", true);
      chatInputSend.innerHTML = "Send";

      // Input element for user to enter their message
      var chatInput = document.createElement("input");
      chatInput.setAttribute("id", "chat_input");
      chatInput.setAttribute("maxlength", 128);
      chatInput.placeholder = `${parent.getName()}. Say something! (Max 128 Characters)`;

      // Add event listener to enable the send button when input is not empty
      chatInput.onkeyup = function () {
        if (chatInput.value.length > 0) {
          chatInputSend.removeAttribute("disabled");
          chatInputSend.classList.add("enabled");
          chatInputSend.onclick = function () {
            chatInputSend.setAttribute("disabled", true);
            chatInputSend.classList.remove("enabled");
            if (chatInput.value.length <= 0) {
              return;
            }
            parent.createLoad("chat_content_container");
            parent.sendMessage(chatInput.value);
            chatInput.value = "";
            chatInput.focus();
          };
        } else {
          chatInputSend.classList.remove("enabled");
        }
      };

      var chatLogoutContainer = document.createElement("div");
      chatLogoutContainer.setAttribute("id", "chat_logout_container");

      var chatLogout = document.createElement("button");
      chatLogout.setAttribute("id", "chat_logout");
      chatLogout.textContent = `${parent.getName()} • logout`;
      chatLogout.onclick = function () {
        localStorage.clear();
        parent.home();
      };

      // Append elements to the chat container
      chatLogoutContainer.append(chatLogout);
      chatInputContainer.append(chatInput, chatInputSend);
      chatInnerContainer.append(
        chatContentContainer,
        chatInputContainer,
        chatLogoutContainer
      );
      chatContainer.append(chatInnerContainer);
      document.body.append(chatContainer);

      // Create a loading circle and refresh the chat
      parent.createLoad("chat_content_container");
      parent.refreshChat();
    }

    // Method to save the name to localStorage
    saveName(name) {
      localStorage.setItem("name", name);
    }


    // Method to send a message and save it to the Firebase database
    async sendMessage(message) {
      var parent = this;

      // Check if the local storage name is null and there is no message
      // Return if the user is somehow trying to send messages without a name
      if (parent.getName() == null && message == null) {
        return;
      }

      // Get the profanity filter API response
      const response = await fetch(
        "https://api.api-ninjas.com/v1/profanityfilter?text=" + message,
        {
          method: "GET",
          headers: {
            "X-Api-Key": "pUlebjjs2JSNHEbVwtpB4g==vZosueTkXHXSNeRO",
          },
          contentType: "application/json",
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Get the Firebase database value
        db.ref("chats/").once("value", function (messageObject) {
          // Index to help organize the chat in order
          var index = parseFloat(messageObject.numChildren()) + 1;
          
          // Create a new Date object with the current date and time in the user's local time zone
          const localDate = new Date();

          // Get individual components of the local date and time
          const year = localDate.getFullYear();
          const month = localDate.getMonth() + 1; // Months are zero-based, so add 1
          const day = localDate.getDate();
          const hours = localDate.getHours();
          const minutes = localDate.getMinutes();
          const seconds = localDate.getSeconds();

          // Format the components as a string
          const formattedLocalDateTime = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;


          // Check if the message contains profanity
          if (result.has_profanity) {
            // Save the message to Firebase
            db.ref("chats/" + `message_${index}`)
              .set({
                name: parent.getName(),
                message: result.censored,
                index: index,
                timestamp: formattedLocalDateTime,
              })
              .then(function () {
                // After sending the chat, refresh to get the new messages
                parent.refreshChat();
              });
          }
          // If the message does not contain profanity, save the message to Firebase
          else {
            // Save the message to Firebase
            db.ref("chats/" + `message_${index}`)
              .set({
                name: parent.getName(),
                message: message,
                index: index,
                timestamp: formattedLocalDateTime,
              })
              .then(function () {
                // After sending the chat, refresh to get the new messages
                parent.refreshChat();
              });
          }
        });
        console.log(result);
      } else {
        throw new Error("There was an error getting the profanity filter");
      }
    }

    // Method to get the username from localStorage
    getName() {
      // Get the name from local storage
      if (localStorage.getItem("name") != null) {
        return localStorage.getItem("name");
      } else {
        this.home();
        return null;
      }
    }

    // Method to refresh the chat by getting message data from Firebase
    refreshChat() {
      var chatContentContainer = document.getElementById(
        "chat_content_container"
      );

      // Get the chats from Firebase in real-time
      db.ref("chats/").on("value", function (messagesObject) {
        // Clear the chat content container when data is received
        chatContentContainer.innerHTML = "";

        // Return if there are no messages in the chat
        if (messagesObject.numChildren() == 0) {
          return;
        }

        // Convert the message object values to an array
        var messages = Object.values(messagesObject.val());
        var guide = []; // Array to organize the messages
        var unordered = []; // Unordered messages
        var ordered = []; // Ordered messages

        // Loop to set up the guide and unordered arrays
        for (var i, i = 0; i < messages.length; i++) {
          guide.push(i + 1);
          unordered.push([messages[i], messages[i].index]);
        }

        // Reverse the guide array to order from recent to older messages
        guide.reverse();

        // Sort the unordered messages by the guide
        guide.forEach(function (key) {
          var found = false;
          unordered = unordered.filter(function (item) {
            if (!found && item[1] == key) {
              ordered.push(item[0]);
              found = true;
              return false;
            } else {
              return true;
            }
          });
        });

        // Display the ordered messages
        ordered.forEach(function (data) {
          var name = data.name;
          var message = data.message;
          var timestamp = data.timestamp;

          var messageContainer = document.createElement("div");
          messageContainer.setAttribute("class", "message_container");

          var messageInnerContainer = document.createElement("div");
          messageInnerContainer.setAttribute(
            "class",
            "message_inner_container"
          );

          var messageUserContainer = document.createElement("div");
          messageUserContainer.setAttribute("class", "message_user_container");

          var messageUser = document.createElement("p");
          messageUser.setAttribute("class", "message_user");
          messageUser.textContent = `${name}`;

          var messageContentContainer = document.createElement("div");
          messageContentContainer.setAttribute(
            "class",
            "message_content_container"
          );

          var messageContent = document.createElement("p");
          messageContent.setAttribute("class", "message_content");
          messageContent.textContent = `${message}` + '\n\n\n' + '-' + `${timestamp}`;

          messageUserContainer.append(messageUser);
          messageContentContainer.append(messageContent);
          messageInnerContainer.append(
            messageUserContainer,
            messageContentContainer,
          );
          messageContainer.append(messageInnerContainer);

          chatContentContainer.append(messageContainer);
        });

        // Scroll to the bottom of the container to show the most recent message
        chatContentContainer.scrollBottom = chatContentContainer.scrollHeight;
      });
    }
  }

  // Instantiate the app
  var app = new AnonymousChat();

  // If a name is stored in localStorage, go to the chat page; otherwise, go to the home page
  if (app.getName() != null) {
    app.chat();
  }
};

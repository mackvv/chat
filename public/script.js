let socket = io("https://ofisdfh.azurewebsites.net/");

socket.on('connected', () => {
  let userName = prompt("Enter a username", "UserName");
  socket.emit("login", userName);
});

socket.on('userInUse', () => {
  let userName = prompt("User already in use! Please enter a new username", "UserName");
  socket.emit("login", userName);
})

function logout(){
  socket.emit('logout');
}

socket.on("ROOMS", rooms => {
  let el = document.getElementById('RoomButtons');
  el.innerHTML = "";

  for (let i =0; i < rooms.length; i++) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-outline-primary');
    button.innerText = rooms[i];
    button.onclick = () => {
      socket.emit("Change Room", rooms[i]);
      let msgBlock = document.getElementById('MESSAGES');
      msgBlock.innerHTML = ""
      $("#exampleModal").modal('hide')
    }
    el.append(button);
  }

  let hr = document.createElement('hr');
  el.append(hr);

  let button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('class', 'btn btn-outline-primary');
  button.innerText = "Create Room";
  button.onclick = () => {
    let newRoom = prompt("Room Name");
    socket.emit("Change Room", newRoom);
    let msgBlock = document.getElementById('MESSAGES');
    msgBlock.innerHTML = ""
    $("#exampleModal").modal('hide')
  }
  el.append(button);
})

function sendMessage() {
  let el = document.getElementById('msgText');
  let msg = el.value;
  el.value = "";
  socket.emit("MessageToServer", msg);

  let msgBlock = document.getElementById('MESSAGES');
  let rowWrap = document.createElement('div');
  rowWrap.setAttribute('class', 'row justify-content-end');

  let innerData = document.createElement('div');
  innerData.setAttribute('class', 'col-sm-5 user2');
  innerData.innerText = msg;

  rowWrap.append(innerData)
  msgBlock.prepend(rowWrap)
}



socket.on("MessageFromServer", dataPacket => {
  console.log(dataPacket);

  let msgBlock = document.getElementById('MESSAGES');
  let rowWrap = document.createElement('div');
  rowWrap.setAttribute('class', 'row');

  let innerData = document.createElement('div');
  innerData.setAttribute('class', 'col col-sm-5 user1');
  innerData.innerText = dataPacket['fromUser'] + ":\n" +dataPacket.msg;

  rowWrap.append(innerData)
  msgBlock.prepend(rowWrap)
});

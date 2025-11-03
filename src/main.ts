import { connectToServer } from "./socket-client";
import "./style.css";
// import typescriptLogo from "./typescript.svg";
// import viteLogo from "/vite.svg";
// import { setupCounter } from "./counter.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h2>Websocket-Client</h2>

    <!--Agregaremos una caja de texto para colocar el jwt para la validacio  -->
    
    <input id="jwt-Token"  placeholder="Json Web Token"/>

     <buttom  id="btn-connect">Connect</buttom>

     <br/>






    <span  id="server-status" >Offline</span>

    <!---Lista de clientes conectados  -->
    <ul id ="clients-ul">
    
    <!--aqui es  donde voy a colocar los clientes conectados-->
    
    </ul>

    <!--  Formulario para enviar mensajes  -->

    <!--explicaion: despues de escribir en la caja de texto , y le doy enter -->
     <!--dispara el sumit del formulario y luego tomo el sumit del formulario tomo el id -->
     <!--id = "message-input"--->
     <form  id="message-form" >
      <input placeholder="message" id = "message-input"/>
    </form> 



    <!---Lista de mensajes  -->

    <h3>Messages</h3>
    
    <ul id="messages-ul">
    
    <!--aqui es  donde voy a colocar los mensajes  -->
    
    </ul>
    
    

  </div>
`;
//hagamos el procedimento par pbtenr el jwt y luego si llamemos a la funcion connectToServer con el jwt.
const jwtToken = document.querySelector<HTMLInputElement>("#jwt-Token")!;
const btnConnect = document.querySelector<HTMLButtonElement>("#btn-connect")!;

btnConnect.addEventListener("click", () => {
  //Chequemos el jwt
  if (jwtToken.value.trim().length <= 0) {
    alert("Please enter a valid JWT token");
    return;
  }
  connectToServer(jwtToken.value.trim()); //llamamos a la funcion connectToServer para hacer la conexion con el servidor
});

//lamemos la funcion connectToServer() para hacer la conexion con el servidor que es mi aplicacion que estoy simulando en uro servidor.

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

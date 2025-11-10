import { Manager, Socket } from "socket.io-client";

//utilzemos un varible llamada socet para que cuando se crea en nuevo socet ella
// podamos reutilizarla en otras partes del codigo
let socket: Socket;

//Crearemos una funcion que la utilzare para hacer la conexxion con el servidor
export const connectToServer = (token: string) => {
  // http://localhost:3000/socket.io/socket.io.js
  // const manager = new Manager("http://localhost:3000/socket.io/socket.io.js", {
  const manager = new Manager(
    "https://teslo-shop-ktv7.onrender.com/socket.io/socket.io.min.js",
    {
      extraHeaders: {
        hola: "mundo",
        authentication: token, //aqui enviamos el jwt al servidor para que lo valide
      },
    }
  );
  //Aseguremos que si existe el socket o es null , eliminaremos los listeners que pueda tener el socket antes de agregar nuevos listeners
  socket?.removeAllListeners();

  socket = manager.socket("/"); //Me estoy conectando a nsp "que es la la raiz de la aplicaciondonde quiero conectame",
  //esta infomacion del manager me va a generar nuestro socket que sera la comunicacion activo-activo con nuestro servidor.
  // console.log(socket);

  addListeners(); //Se eleimonina el argumento socket porque ya es una variable global
};
//ahora vereos cuales clientes estamos conectados. regresando al servidor para hacer unas modificaciones .
//recurede que el servidor es la aplicacion que estamos corriendo(04-Teslo-shop
const addListeners = () => {
  //eliminamos el argumento socket porque ya es una variable global
  //TODO: #clients-ul donde de voy a colocar los clientes conectados
  //* variable para actualizar la lista de clientes conectados llamada clientesUl la cual buscamos en el html por su id "#clients-ul"
  const clientsUl = document.querySelector<HTMLUListElement>("#clients-ul")!;
  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;
  const messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;
  const serverStatusLabel = document.querySelector("#server-status")!;

  //con la dos variables; messageForm y messageInput, de abajo vamos a capturar el formulario y el input del
  // formulario para enviar mensajes al servidor
  //el simbolo de ! le dice a typescript que no importa que pueda ser null
  //y siempre va a tener un valor. y se le dice que el tipado
  //  es HTMLFormElement para messagForm y HTMLInputElement para messageInput.
  //codigo para detectar la conexion al servidor
  socket.on("connect", () => {
    // console.log("connected"); // se comento porque ya se que funciona
    //modifiquemoas el html para mostrar el estado de la conexion
    serverStatusLabel.innerHTML = "connected";
  });

  //Codigo para detectar la desconexion del servidor
  socket.on("disconnect", () => {
    // console.log("disconnect"); //se comenta proque ya se que funciona
    //modifquemos el html para mostrar el estado de la conexion
    serverStatusLabel.innerHTML = "disconnected";
  });

  //!++++++++++

  //*********
  //cuando se conecta el cliente, se escuche el evento "clients-updated" que es un evento personalizado que
  //hemos creado en el servidor, y los cielnets es un arreglo de string que contiene los ids de los clientes conectados.
  socket.on("clients-updated", (clients: string[]) => {
    //hacemos un console log para ver los clientes conectados.
    //console.log({ clients }); //vemos los ids de los clientes conectados
    //ahora vamos a actualizar el html para ver los clientes conectados

    //actualicemos la lista de clientes conectados en el ul que sse llama clients-ul
    let clientsHtml = ""; //inicializamos una variable vacia
    //recorremos el arreglo de clientes conectados

    clients.forEach((clientId) => {
      clientsHtml += `<li>${clientId}</li>`; //para cada cliente conectado, agregamos un elemento li con el id del cliente para
      //mostrarlo en el html.
    });

    //lo insertamos la lista  actuaizada de clientes  en el html del ul, que son los clientes conectados.
    clientsUl.innerHTML = clientsHtml;
  });
  //!+++++++++
  // ****** */

  //escuchemos in listen del formulario para capturar el evento submit
  messageForm.addEventListener("submit", (event) => {
    event.preventDefault(); //llamo esta instrucción para que no recarge la pagina

    //tomemos el valor de la caja de texto para ver si tenemos
    // algo para mandadar al servidor
    if (messageInput.value.trim().length <= 0) return; // tomamoe le valor que hay en la
    // caje de texto con ".value" y limpiamos los espacios
    //  al principio y a final de lo esctrito co "-trim()"
    // y   si no hay nada chequedo con ".length<=0"
    // ,en la caja de texto no hagas nada devolviendo "return;".

    //MAndemos un console.log() mandando un objeto,
    // que tiene el id:"diciendo que soy yo",
    // y un message: para ver que estamos capturando bien el valor de la caja de texto.
    //ahora comentamos este console.log porque ya no lo necesitamos.
    // console.log({ id: "YO!!", message: messageInput.value });
    //ahora mandemos el mensaje al servidor con el socket.emit()
    //el primer argumento es el nombre del evento personalizado "message-from-client"
    //y el segundo argumento es el objeto que queremos mandar al servidor
    socket.emit(
      "message-from-client", //nombre del evento personalizado

      {
        id: "YO!!",
        message: messageInput.value,
      } //objeto con el id y el mensaje
    );
    //despues de mandar el mensaje al servidor, limpiemos la caja de texto
    messageInput.value = "";
  });

  //*escuchamos  los mensajes que vienen del servidor al cliente i se haran como una socket.on
  socket.on(
    "message-from-server", //nombre del evento personalizado que viene del servidor
    (payload: { fullName: string; message: string }) => {
      //el payload es un objeto que tiene el fullName y el message
      // console.log(payload); //veamos el payload en consola
      //?mostremos los mensajes que se envian desde el servidor en el html
      const newMessage = `
      <li>
      
      <strong>${payload.fullName}</strong> <!--mostramos el nombre quien mando el mensaje  en negritas-->

      
      <span>${payload.message}</span> <!--mostramos el mensaje dentro de un span-->

      </li>
      `;
      //creamos un nuevo mensaje en formato html
      //messagesUl.innerHTML += newMessage; //agregamos el nuevo mensaje al ul de mensajes o lo podemos de esta manera :
      const li = document.createElement("li"); //creamos un elemento li
      li.innerHTML = newMessage; //le asignamos el nuevo mensaje al li
      messagesUl.append(li); //agregamos el li al ul de mensajes
    }
  );
};
//*Para mañana 29-10-2025;  se debe identificar quien envia el mensaje desde el servidor y mostrar su nombre en el cliente.
//*Para esto se debe modificar el servidor para que envie el nombre completo del usuario que envia el mensaje.
//*Luego se debe modificar el cliente para que reciba el nombre completo y lo muestre en el html junto con el mensaje.
//*Ademas, se debe agregar un campo de texto en el cliente para que el usuario pueda ingresar su nombre completo antes de enviar un mensaje.
//*Finalmente, se debe probar que todo funcione correctamente enviando mensajes desde diferentes clientes y verificando que se muestre el nombre correcto junto con el mensaje en cada cliente.

// framework express.js
//? Importar: express y cors, crea app con express() y usalos:
import express from "express";
import cors from 'cors';


import {supabase} from './supabaseClient.js'

const app = express()
app.use(express.json()) 


//todo:explicar CORS"
//*👀👀👀👀🚩🚩🚩🤯 en la URL de los origin permitidos 🚫❌NO COLOCAR path ->.index.html❌🚫 
//app.use(cors()) //*permite todos los clients que deseen hacer req
//app.use(cors({origin:'*'})) //*permite todos los clients que deseen hacer req

//app.use(cors({origin:'http://127.0.0.1:5501'})) //*permite solo ese dominio client

//!ESTABA BOLQUEADO EN LA ULTIMA CLASE
const allowedOrigins = [
  'http://127.0.0.1:5501', 
  'http://127.0.0.1:3000',
]

app.use(cors({
  origin: (origin, callback) =>{
    if(!origin || allowedOrigins.includes(origin)) callback(null, true) //*✅ No hay error y origen autorizado
    else callback(new Error('Origin NO permitido por CORS 🚫') , false) //*🚫 Origin No autorizado
  }
}))


const PORT = 3000

app.get('/', (req, res) => {
    res.send('Hola desde el backend')
})
app.get('/home', (req, res) => {
    res.send('<h1>Hola desde el HOME</h1>')
})

//?Explicacion sincronia
// const nom = 'edily' 
// nom+=' Rosa'
// console.log(nom);

app.get('/usuarios', async (req, res) => {
    let { data, error } = await supabase.from('usuarios').select('*')
  if(error){
    console.error('Error al obtener usuarios', error)
    return res.status(500).send('Error al obtener usuarios, BACK')
  }
  res.json(data)//servidor, data esta en bbdd y se envia al client
})


 app.get('/usuarios/:id', async (req, res)=>{
  const id = parseInt(req.params.id)
  let { data, error } = await supabase.from('usuarios').select("*").eq('id', id).single()
  if(error) return res.status(500).send('Error al obtener usuario del ID dado, BACK')
  if(error) return res.status(400).send('Error al obtener usuario del ID dado, BACK')
  res.json(data)//servidor, data esta en bbdd y se envia al client

 })


app.put('/usuarios/:id', async (req, res)=> {
    const id = parseInt(req.params.id)
    const usuario = req.body
    if( //*client podria enviar un null, y este servidor lo aceptaria sino valida, AL MENOS UN CAMPO DEBE SER ENVIADO
      usuario.nombre === undefined &&
      usuario.email === undefined &&
      usuario.foto === undefined &&
      usuario.genero === undefined &&
      usuario.aceptacion === undefined &&
      usuario.edad === undefined
    ) return res.status(400).json({error:'Al menos un campo debe ser actualizado'})

    const camposActualizar = {}
    if(usuario.nombre !== undefined) camposActualizar.nombre = usuario.nombre
    if(usuario.email !== undefined) camposActualizar.email = usuario.email
    if(usuario.foto !== undefined) camposActualizar.foto = usuario.foto
    if(usuario.aceptacion !== undefined) camposActualizar.aceptacion = usuario.aceptacion
    if(usuario.edad !== undefined) camposActualizar.edad = usuario.edad
    if(usuario.genero !== undefined) camposActualizar.genero = usuario.genero

    const { data, error } = await supabase.from('usuarios').update(camposActualizar).eq('id',id).select().single()
    if(error) return res.status(500).send('Error al ACTUALIZAR usuario del ID dado, BACK')
    if(data.length ===0) return res.status(500).send('Error al ACTUALIZAR usuario del ID dado NO ENCONTRADO, BACK')
    res.json(data)

})


app.delete('/usuarios/:id', async (req, res)=> {
    const id = parseInt(req.params.id)
    const { error } = await supabase.from('usuarios').delete().eq('id', id)
    if(error) return res.status(500).send('Error al ELIMINAR usuario del ID dado, BACK')
      res.status(200).send('Usuario ELIMINADO exitosamente')

})

//!llenar .gitignire
//TODO: Crear nuevo usuario: API Docus -> tables & views -> Insert a row
app.post('/usuarios', async (req, res) => {

  const objUsuario = req.body

  if( //*hay que validar que client envie todos los campos, para no contaminar o corromper la BBDD
    !objUsuario.nombre ||
    !objUsuario.email  ||
    !objUsuario.foto   ||
    objUsuario.edad === undefined ||
    objUsuario.aceptacion === undefined ||
    objUsuario.genero === undefined
  ) return res.status(400).json({error:'Falta(n) dato(s) para hacer el POST/INSERT del usuario nuevo, BACK'})

  const { data, error } = await supabase.from('usuarios').insert([{ ...objUsuario },]).select().single()
  if(error) return res.status(500).json({error:'Error al hacer el POST/INSERT del usuario nuevo en la BBDD, BACK'})
  res.json(data)

})





//? app.get('usuarios/id', ()=>{})
// app.post('usuarios', (req, res)=> {})
//? app.put('usuarios/id', (req, res)=> {})
//? app.delete('usuarios/id', ()=>{})




app.listen(PORT,()=> console.log('servidor a la escucha en el puerto '+PORT)) //!node index.js pwd



















// //TODO: Obtener usuario por ID:  API Docus -> tables & views -> Read rows -> Filtering ->  // Filters .eq('column', 'Equal to')
// app.get("/usuarios/:id", async (req, res) => {
//     const id = parseInt(req.params.id)
//    const {data, error} = await supabase.from('usuarios').select('*').eq('id', id).single()
//     if(error) return res.status(500).json({error:'Error la obtener al usuario, BACK'})
//     if(!data) return res.status(404).json({error:'Error para encontrar al usuario, BACK'})
//     res.json(data)
// })



// //todo: Actualizar usuario por ID: API Docus -> tables & views -> Update rows
// app.put("/usuarios/:id", async (req, res)=> {
//   const id =  parseInt(req.params.id)
//   const usuario = req.body

//     if( //*Si el frontend envía explícitamente null, tu backend lo aceptaría y enviaria a la BBDD. Validar el client.body
//         usuario.nombre === undefined &&
//         usuario.email === undefined &&
//         usuario.foto === undefined &&
//         usuario.genero === undefined &&
//         usuario.aceptacion === undefined && 
//         usuario.edad === undefined
//     ) return res.status(400).json({error: 'Almenos un campo debe ser enviado para actualizar/put'})
    
//     //*Creamos el Obj a enviar para actualizar el resgistro del ID.
//     const camposActualizar = {}
//     if(usuario.nombre !== undefined) camposActualizar.nombre = usuario.nombre;
//     if(usuario.edad !== undefined && usuario.edad !== null)  camposActualizar.edad = usuario.edad;
//     if(usuario.email !== undefined) camposActualizar.email = usuario.email;
//     if(usuario.foto !== undefined) camposActualizar.foto = usuario.foto;
//     if(usuario.aceptacion !== undefined && usuario.aceptacion !== null) camposActualizar.aceptacion = usuario.aceptacion;
//     if(usuario.genero !== undefined) camposActualizar.genero = usuario.genero;

//     const {data, error} = await supabase.from('usuarios').update(camposActualizar).eq('id', id).select()

//     if(error) res.status(500).json({error:'Error al actualizar el usuario BACK'})
//     if(data.length === 0) res.status(404).json({error:'Usuario no encontrado, BACK'})
//       res.json(data[0]) //? Enviamos el usuario actualizado
// })


// //todo: Eliminar usuario por ID: API Docus -> tables & views -> Delete rows
// app.delete("/usuarios/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const { data, error } = await supabase.from("usuarios").delete().eq("id", id).select();

//   if (error) {
//     console.error("Error al eliminar usuario", error);
//     return res.status(500).json({ error: "Error al eliminar usuario BACK" });
//   }

//   if (data.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
//   res.status(200).send();
// })





//! TODO: Crear nuevo usuario: API Docus -> tables & views -> Insert a row
// app.post("/usuarios", async (req, res )=> {
//     const usuario = req.body
     
//     if( //*Si el frontend envía explícitamente null, tu backend lo aceptaría y enviaria a la BBDD. Validar el client.body
//         !usuario.nombre ||
//         !usuario.email ||
//         !usuario.foto ||
//         usuario.edad === undefined ||       // !0 es true y eso haría fallar la validación erróneamente.
//         usuario.aceptacion === undefined || //!  usuario.edad === undefined o usuario.edad == null (detecta null o undefined).
//         usuario.genero === undefined
//     ) return res.status(400).json({error:'Faltan datos para hacer post de usuario, BACK'})

//     const {data, error} = await supabase.from('usuarios').insert([{...usuario}]).select().single() //*Enviamos y lo recuperamos

//     if(error) return res.status(500).json({error:'Error al crear/postear nuevo usario, BACK'})

//     res.json(data)
// })



//TODO:cors
// app.use(cors({
//   origin:'http://127.0.0.1:5501/index.html'
// }))

// const allowedOrigins = [
//   'http://127.0.0.1:5501/index.html',
//   'http://127.0.0.1:3000/index.html'
// ]

// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin || allowedOrigins.includes(origin)) callback(null, true) //*✅Permite acceso
//     else callback(new Error('origin no permitido por CORS'), false) //!🚫Denegado acceso
//   }

// }))
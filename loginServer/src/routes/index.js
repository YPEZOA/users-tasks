const { Router } = require('express')
const router = Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Task = require('../models/task');

// Datos de usuario
router.get('/getUserData/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id).select('email _id user avatar').populate('tasks', {
    title: 1,
    description: 1,
    _id: 1
  })
  res.status(200).json({ok:true, user})
})

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, user, password } = req.body;
  user.toLowerCase()
  const newUser = new User({ avatar: '', email, user, password, tasks: [] });

  // Verificar si email existe
  const userEmail = await User.findOne({ email })
  if (userEmail) return res.status(401).json({ok: false, message: 'El email ya existe en los registros'});

  await newUser.save();

  const token = jwt.sign({ _id: newUser._id }, 'secretkey')
  return res.status(200).json({ token, ok: true, message: 'Usuario creado exitosamente', userData: { email, userName: newUser.user, avatar: newUser.avatar, userId: newUser._id } })
})

// Login de usuario
router.post('/signin', async (req, res) => {
  const { user, password } = req.body;
  const findUser = await User.findOne({ user });
  if (!findUser) res.status(401).json({
    ok: false,
    message: 'Usuario o contraseña incorrectos'
  })
  if (findUser.password !== password) return res.status(401).json({ok: false, message: 'Contraseña incorrecta'})
  const data = await User.findOne({ user }).select('_id email user')

  const token = jwt.sign({ _id: findUser._id }, 'secretkey')
  return res.status(200).json({ token, ok: true, userData: data })
})

//Actualizacion de usuario
router.put('/updateUser/:_id', verifyToken, async (req, res) => {
  const { _id } = req.params;
  const { ...data } = req.body;

  try {
    await User.findByIdAndUpdate(_id, data)
    return res.status(200).json({
      ok: true,
      message: 'Usuario actualizado con éxito',
    })
  } catch(err) {
    res.send(err)
  }
})

// Obtener todas las tareas
router.get('/getTasks', async (req, res) => {
  const tasks = await Task.find().populate('user', {
    user: 1,
  })
  const userData = tasks.map(tasks => tasks.user)
  res.status(200).json({ok: true, tasks, userData})
})

// Obtener tareas del usuario
router.post('/getUserTasks', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId).select('_id email user').populate('tasks', {
    title: 1,
    description: 1,
    complete: 1
  })
  return res.status(200).json({ ok: true, data: user })
})

// Crear tarea
router.post('/new-task', verifyToken, async (req, res) => {
  const { title, description, userId, complete = false } = req.body;
  const user = await User.findById(userId)

  if (!title || !description) {
    return res.status(401).json({ ok: false, message: 'Validar campos' })
  }

  const newTask = new Task({
    title,
    description,
    complete,
    user: user._id
  })

  try {
    const savedTask = await newTask.save();
    user.tasks = user.tasks.concat(savedTask._id)
    await user.save();
    res.status(200).json({ message: 'Tarea creada con éxito', ok: true })
  } catch (err) {
    next(err)
  }

})

router.delete('/delete-task/:taskId', verifyToken, async (req, res) => {
  const { taskId } = req.params;
  await Task.findByIdAndDelete(taskId, (err, task) => {
    if (err && task == null) return res.status(500).json({ok: false, message: 'No se puede eliminar la tarea, intentalo de nuevo'})
    return res.status(200).json({ok: true, message: 'Tarea eliminada', tarea: task})
  })
})

router.put('/update-task/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const task = await Task.findByIdAndUpdate(id, data )

  try {
    task.complete = true
    await task.save();
    return res.status(200).json({ok: true, message: 'Tarea actualizada'})
  } catch (err){
    console.error(err)
    return res.status(500).json({ok: false, message: err})
  }
})


module.exports = router;

// Verificar si token existe
function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorize request')
  }

  const token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unathorize request');
  }

  const payload = jwt.verify(token, 'secretkey')
  req.userId = payload._id
  next();
}

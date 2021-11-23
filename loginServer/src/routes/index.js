const { Router } = require('express')
const router = Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Task = require('../models/task');

// Datos de usuario
router.get('/getUsersData', async (req, res) => {
  const users = await User.find({}).populate('tasks', {
    title: 1,
    description: 1,
    complete: 1
  });
  res.status(200).json({users})
})

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, user, password } = req.body;
  const newUser = new User({ avatar: '', email, user, password, tasks: [] });

  // Verificar si email existe
  const userEmail = await User.findOne({ email })
  if (userEmail) return res.status(401).json({status: 0, message: 'El email ya existe en los registros'});

  await newUser.save();

  const token = jwt.sign({ _id: newUser._id }, 'secretkey')
  return res.status(200).json({ token, status: 1, message: 'Usuario creado exitosamente', userData: { email, userName: newUser.user, avatar: newUser.avatar, userId: newUser._id } })
})

// Login de usuario
router.post('/signin', async (req, res) => {
  const { user, password } = req.body;
  const findUser = await User.findOne({ user });
  if (!findUser) res.status(401).json({
    status: 0,
    message: 'Usuario o contraseña incorrectos'
  })
  if (findUser.password !== password) return res.status(401).json({status: 0, message: 'Contraseña incorrecta'})

  const token = jwt.sign({ _id: findUser._id }, 'secretkey')
  return res.status(200).json({ token, status: 1, userData: { userName: findUser.user, email: findUser.email, avatar: findUser.avatar, userId: findUser._id } })
})

//Actualizacion de usuario
router.put('/updateUser/:_id', verifyToken, async (req, res) => {
  const { _id } = req.params;
  const { ...data } = req.body;

  await User.findByIdAndUpdate(_id, data)

  return res.status(200).json({
    status: 1,
    message: 'Usuario actualizado con éxito',
  })
})

// Obtener todas las tareas
router.get('/getTasks', async (req, res) => {
  const tasks = await Task.find().populate('user', {
    user: 1,
    email: 1
  })
   res.status(200).json(tasks)
})

// Obtener tareas del usuario
router.post('/getUserTasks', verifyToken, async (req, res) => {
    const { userId } = req.body;
    const user = await User.findById(userId).select('_id email user').populate('tasks', {
    title: 1,
    description: 1
  })
  return res.status(200).json({ status: 1, data: user })
})

// Crear tarea
router.post('/new-task', verifyToken, async (req, res) => {
  const { title, description, userId, complete = false } = req.body;
  const user = await User.findById(userId)
  if (!title || !description) {
    return res.status(401).json({ status: 0, message: 'Validar campos' })
  }

  const newTask = new Task({
    title,
    description,
    complete,
    user: user._id
  })
  console.log(newTask)

  try {
    const savedTask = await newTask.save();
    user.tasks = user.tasks.concat(savedTask._id)
    await user.save();
  } catch (err) {
    next(err)
  }

})

router.get('/my-tasks', verifyToken, (req, res) => {

})

module.exports = router;

// Verificar si token existe
function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1]

  if (!req.headers.authorization) { return res.status(401).json({
    status: 0,
    message: 'Unauthorized request'
  })}

  if(token === 'null') {
    return res.status(401).json({
      status: 0,
      message: 'Unauthorized request'
    })
  }

  const payload = jwt.verify(token, 'secretkey')

  req.userId = payload._id;
  next();
}

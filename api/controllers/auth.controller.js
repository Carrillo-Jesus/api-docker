const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('@/models/user.model');
const Emitter = require('@/events/mails/events');
const secret = process.env.JWT_SECRET;

const AuthController = {
    async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.scope('withPassword').findOne( { where: { email } } );

            if (!user || !user.confirmed) {
                return res.status(400).send({ message: 'EL usuario no existe o no está confirmado' });
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(400).send({ message: 'La contraseña o el usuario son incorrectos' });
            }

            delete user.dataValues.password;

            const expiresIn = parseInt(process.env.JWT_EXPIRES_IN);
            const token = jwt.sign({ user }, secret, {
                expiresIn
            });

            res.status(200).send({ auth: true, token, user });
        } catch (error) {
            console.error(error);
            res.status(500).send({message: 'Ocurrió un problema al intentar iniciar sesión'});
        }
    },

    async register(req, res) {
        const { email, password } = req.body;
        try {

            const userExistsByEmail = await User.findOne({ where: { email } });

            if (userExistsByEmail) {
                return res.status(400).send({ message: 'El email ya está en uso' });
            }

            // const userExistsByUsername = await User.findOne({ where: { username } });

            // if (userExistsByUsername) {
            //     return res.status(400).send({ message: 'The username is already in use' });
            // }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const user = await User.create( { email, password: hashedPassword } );
            delete user.dataValues.password;

            const token = jwt.sign({ user: user }, secret, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            Emitter.emit('user.registered', user);

            res.status(200).send({ auth: true, token, user });
        } catch (error) {
            console.log(error);
            res.status(500).send({message: 'Ocurrió un problema al registrar la cuenta'});
        }
    },

    async confirmAccount(req, res) {
        try {
            const { token } = req.params;
            
            if (!token || token === '0' || token.trim() === '') {
                return res.status(400).send({ message: 'Token no válido' });
            }

            let userId;
            try {
                const decoded = jwt.verify(token, secret);
                userId = decoded.userId;
            } catch (error) {
                return res.status(400).send({ message: 'Token no válido' });
            }
        
            const user = await User.findByPk(userId);
            if (!user) {
              return res.status(404).send({ message: 'Token no válido' });
            }
        
            user.confirmed = true;
            await user.save();

            res.send({ message: 'Cuenta confirmada con éxito.' });
          } catch (error) {
            console.log(error);
            res.status(400).send({ message: 'Error al confirmar la cuenta.' });
          }
    }

};

module.exports = AuthController;
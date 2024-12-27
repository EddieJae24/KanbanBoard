import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';
export class User extends Model {
    // Hash the password before saving the user
    async setPassword(password) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(password, saltRounds);
    }
}
export function UserFactory(sequelize) {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            //   validate: {
            //     notNull: {
            //       msg: 'Please enter a password',
            //     },
            //     len: {
            //       args:[8, 20],
            //       msg: 'Password must be between 8 and 20 characters long',
            //   },
            // },
        },
    }, {
        tableName: 'users',
        sequelize,
        hooks: {
            beforeCreate: async (user) => {
                await user.setPassword(user.password);
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                }
                await user.setPassword(user.password);
            },
        }
    });
    return User;
}

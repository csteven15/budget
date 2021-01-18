import React, { FC } from 'react'
import { useForm } from "react-hook-form"
import { Button, TextField } from "@material-ui/core"
import { IUser } from '../../common/types/IUser';
import Api from '../../util/Api';
import { useUser } from '../../context/UserContext';

const Register: FC = () => {
  const { register, handleSubmit } = useForm<IUser>();
  const { setUser } = useUser();

  const onSubmit = async (formData: IUser) => {
    try {
      const res = await Api.post('/user', formData);
      console.log('post', res); 
      console.log('/auth/register', res);
      let user: IUser = {
        name: '',
        email: '',
        isLoggedIn: false
      };
      if (typeof res.data === 'object')
      {        
        user.id = res.data._id;
        user.name = res.data.name;
        user.email = res.data.email;
        user.isLoggedIn = true;
      }
      setUser(user);
    } catch (error) {
      console.log("error", error)
    }
  }

  return (
    <div>
      <form>
        <TextField id="standard-basic" label="Name" name="name" inputRef={register} />
        <TextField id="standard-basic" label="Email" name="email" inputRef={register} />
        <TextField id="standard-basic" label="Password" name="password" inputRef={register} />
        <Button onClick={handleSubmit(onSubmit)} type="submit">Register</Button>
      </form>
    </div>
  )
}

export default Register;

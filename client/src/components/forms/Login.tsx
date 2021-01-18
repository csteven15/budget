import React, { FC } from 'react'
import { useForm } from "react-hook-form"
import { Button, TextField } from "@material-ui/core"
import { IUser } from '../../common/types/IUser';
import Api from '../../util/Api';
import { useUser } from '../../context/UserContext';

const Login: FC = () => {

  const { register, handleSubmit } = useForm<IUser>()

  const { setUser } = useUser();

  const onSubmit = async (formData: IUser) => {
    try {
      const res = await Api.post('/auth/login', formData);
      console.log('/auth/login', res);
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
        <TextField id="standard-basic" label="Email" name="email" inputRef={register} />
        <TextField id="standard-basic" label="Password" name="password" inputRef={register} />
        <Button onClick={handleSubmit(onSubmit)} type="submit">Login</Button>
      </form>
    </div>
  )
}

export default Login;
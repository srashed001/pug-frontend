import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ login }) {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    let res = await login(formData);
    if (res.success) {
      navigate(`/`);
    } else {
      setFormData(res.errors);
    }
  }

  async function handleChange(evt){
      const {name, value} = evt.target
      setFormData(d => ({...d, [name]: value}))
  }

  return (
    <div>
      <h1>LoginForm</h1>
      <form onSubmit={handleSubmit}>
          <input 
          value={formData.username}
          onChange={handleChange}
          placeholder='username'
          name="username"
          />
          <input 
          value={formData.password}
          onChange={handleChange}
          placeholder='password'
          name="password"
          />
        <button>submit</button>

      </form>
    </div>
  );
}

export default LoginForm;

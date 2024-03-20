// import {useEffect, useState} from 'react';
// import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from '@mui/material';
//
// const Register = () => {
//   const [companies, setCompanies] = useState([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     password_confirmation: '',
//     role: '',
//     company_id: '',
//   });
//
//   useEffect(() => {
//     fetch('http://localhost:8080/companies').then(response => response.json()).then(data => setCompanies(data));
//   }, []);
//
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:8080/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();
//       localStorage.setItem('token', data.token);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };
//
//   return (
//     <form onSubmit={handleSubmit}>
//       <TextField label="Name" name="name" onChange={handleChange}/>
//       <br/>
//       <TextField label="Email" name="email" type="email" onChange={handleChange}/>
//       <br/>
//       <TextField label="Password" name="password" type="password" onChange={handleChange}/>
//       <br/>
//       <TextField label="Confirm Password" name="password_confirmation" type="password" onChange={handleChange}/>
//       <br/>
//       <TextField label="Role" name="role" onChange={handleChange}/>
//       <br/>
//       <FormControl fullWidth>
//         <InputLabel>Company</InputLabel>
//         <Select name="company_id" value={formData.company_id} label="Company"
//                 onChange={handleChange}>
//           {
//             companies.map((company) => (
//               <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
//             ))
//           }
//         </Select>
//       </FormControl>
//       <br/>
//       <Button type="submit" variant="contained">Register</Button>
//     </form>
//   );
// };
//
// export default Register;
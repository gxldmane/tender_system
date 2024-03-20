"use client"
import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Register() {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    company_id: '',
  });
  const { saveToken } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let body = JSON.stringify(formData);
      console.log(body);
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });
      const data = await response.json();
      if (data.token) {
        saveToken(data.token);
        alert(data.message);
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={"flex justify-center items-center h-screen bg-gray-100"}>
      <form onSubmit={handleSubmit}>
        <Label>Имя</Label>
        <Input placeholder="Имя" name="name" onChange={handleChange}/>
        <Label>Почта</Label>
        <Input placeholder="Почта" name="email" type="email" onChange={handleChange}/>
        <Label>Пароль</Label>
        <Input placeholder="Пароль" name="password" type="password" onChange={handleChange}/>
        <Label>Повторите пароль</Label>
        <Input placeholder="Пароль" name="password_confirmation" type="password_confirmation" onChange={handleChange}/>
        <Label>Роль</Label>
        <Select onValueChange={value => setFormData({ ...formData, role: value })}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Выберите роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Выберите роль</SelectLabel>
              <SelectItem value="customer">Заказчик</SelectItem>
              <SelectItem value="executor">Подрядчик</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button type="submit">Register</Button>
      </form>
    </div>

  );
}
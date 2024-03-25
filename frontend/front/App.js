import './App.css';
import Header from './header/Header';
import Title from './title/Title';
import InfoTender from './infoTender/InfoTender';
import Tenders from './tenders/Tenders';
import ChoosingPerformer from './choosingPerformer/ChoosingPerformer';

const data = [
  {description: "Создание БД", price: "500 000руб."},
  {description: "Создание сайта", price: "1 500 000руб."},
  {description: "Создание приложения", price: "2 500 000руб."}
];

const proposals = [
  {name: "ООО “Информационные Системы”", price: "500 000руб."},
  {name: "ООО “Логические Решения”", price: "550 000руб."},
  {name: "ООО “РуТехнологии”", price: "600 000руб."}
];

function App() {
  return (
    <div className="App">
      <Header/>
      <Title text="Просмотр и изменение данных тендера"/>
      <InfoTender name="Проанализировать базу данных клиентов" category="Анализ данных" description="Провести анализ большой базы данных" region="Пермь, Пермский край, Российская Федерация" executor="ООО “Информационные Системы”" price="500 000 руб." time="до 31.12.2024"/>
      <Title text="Мои тендеры"/>
      <Tenders contacts={data}/>
      <Title text="Выбор исполнителя тендера"/>
      <ChoosingPerformer contacts={proposals}/>
    </div>
  );
}

export default App;

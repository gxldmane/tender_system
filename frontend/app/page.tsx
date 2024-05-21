import { Inbox, Merge, Search, Settings, Lock, Users } from "lucide-react";

const features = [
  {
    icon: Inbox,
    title: "Широкий выбор тендеров",
    description: "На платформе представлены различные тендеры в разных отраслях, что позволяет участникам найти наиболее подходящие предложения.",
  },
  {
    icon: Lock,
    title: "Прозрачность и надежность",
    description: "Все тендеры проходят проверку на достоверность, что обеспечивает безопасность участников и защиту их интересов.",
  },
  {
    icon: Settings,
    title: "Удобство использования",
    description: "Интуитивно понятный интерфейс и простота навигации делают процесс участия в тендерах быстрым и легким.",
  },
  {
    icon: Merge,
    title: "Профессиональная поддержка",
    description: "Команда специалистов всегда готова помочь участникам с любыми вопросами или проблемами, возникающими в процессе участия в тендерах.",
  },
  {
    icon: Search,
    title: "Экономия времени и ресурсов",
    description: "Использование платформы позволяет участникам значительно сократить время на поиск и подготовку к участию в тендерах.",
  },
  {
    icon: Users,
    title: "Конкурентная среда",
    description: "Большое количество участников создает здоровую конкуренцию, что стимулирует повышение качества предлагаемых услуг и товаров.",
  },
];

export default function Home() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-8 text-center">
            <div className="space-y-2">
              <h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-black to-stone-900">
                Платформа для проведения тендеров
              </h1>
              <p className="max-w-[600px] text-stone-500 md:text-xl mx-auto">
                Наши возможности направлены на повышение вашей производительности и оптимизацию рабочего процесса
              </p>
            </div>
            <div className="w-full max-w-full space-y-4 mx-auto">
              <div className="grid grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                    <div className="p-2 bg-black rounded-full shadow-lg shadow-slate-800/50">
                      <feature.icon className="text-white h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-black">{feature.title}</h2>
                    <p className="text-stone-500 dark:text-zinc-100">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

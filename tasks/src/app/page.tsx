import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  // Se o usuário já estiver autenticado, redireciona para o dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">TaskSaaS</h1>
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Registrar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="container mx-auto py-16 px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">
              Gerencie suas tarefas com eficiência
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              O TaskSaaS é uma plataforma completa para organização de tarefas e projetos,
              ajudando você a manter o foco no que realmente importa.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Comece Gratuitamente
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg p-4 shadow-lg">
              <div className="bg-white rounded p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center text-white text-xs">✓</div>
                    <p className="font-medium">Planejamento simplificado de tarefas</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center text-white text-xs">✓</div>
                    <p className="font-medium">Acompanhamento de prazos</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center text-white text-xs">✓</div>
                    <p className="font-medium">Organização por prioridades</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 mr-3 flex items-center justify-center text-white text-xs">✓</div>
                    <p className="font-medium">Dashboard personalizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Recursos Principais</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-3">Tarefas Simplificadas</h4>
                <p className="text-gray-600">
                  Crie e organize tarefas de forma rápida e eficiente com nossa interface intuitiva.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-3">Priorização Inteligente</h4>
                <p className="text-gray-600">
                  Organize suas atividades por prioridade e visualize facilmente o que precisa ser feito primeiro.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-semibold mb-3">Prazos e Lembretes</h4>
                <p className="text-gray-600">
                  Defina prazos para suas tarefas e receba lembretes para nunca perder uma data importante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">TaskSaaS</h3>
              <p className="text-gray-400">A melhor maneira de gerenciar suas tarefas</p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h4 className="text-lg font-semibold mb-2">Links</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Recursos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Preços</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">Legal</h4>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacidade</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Termos</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} TaskSaaS. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

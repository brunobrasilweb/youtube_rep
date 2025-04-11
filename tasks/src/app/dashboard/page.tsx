import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Buscar tarefas do usuário
  const userTasks = await db.query.tasks.findMany({
    where: eq(tasks.userId, session.user.id),
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)]
  });

  // Calcular estatísticas
  const todoTasks = userTasks.filter(task => task.status === "todo").length;
  const inProgressTasks = userTasks.filter(task => task.status === "in-progress").length;
  const doneTasks = userTasks.filter(task => task.status === "done").length;
  
  // Separar tarefas por status para exibição nas abas
  const todoTasksList = userTasks.filter(task => task.status === "todo");
  const inProgressTasksList = userTasks.filter(task => task.status === "in-progress");
  const doneTasksList = userTasks.filter(task => task.status === "done");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">TaskSaaS</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg text-gray-800">
            <span className="w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <span className="w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </span>
            <span>Configurações</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={session.user.name} />
              <AvatarFallback>{session.user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-500">Bem-vindo, {session.user.name}!</p>
            </div>
            <Link href="/dashboard/tasks/new">
              <Button>Nova Tarefa</Button>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Tarefas Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{todoTasks}</div>
                <p className="text-xs text-gray-500 mt-1">Tarefas aguardando para serem iniciadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Em Andamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{inProgressTasks}</div>
                <p className="text-xs text-gray-500 mt-1">Tarefas em progresso</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Concluídas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{doneTasks}</div>
                <p className="text-xs text-gray-500 mt-1">Tarefas finalizadas</p>
              </CardContent>
            </Card>
          </div>

          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Minhas Tarefas</CardTitle>
              <CardDescription>Gerencie suas tarefas diárias</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="todo">
                <TabsList className="mb-4">
                  <TabsTrigger value="todo">Pendentes ({todoTasks})</TabsTrigger>
                  <TabsTrigger value="in-progress">Em Progresso ({inProgressTasks})</TabsTrigger>
                  <TabsTrigger value="done">Concluídas ({doneTasks})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="todo">
                  {todoTasksList.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Você não tem tarefas pendentes.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todoTasksList.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                              )}
                              {task.dueDate && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                            <div>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority === 'high' ? 'Alta' :
                                task.priority === 'medium' ? 'Média' : 'Baixa'}
                              </span>
                            </div>
                          </div>
                          <div className="flex mt-4 space-x-2">
                            <Link href={`/dashboard/tasks/${task.id}`}>
                              <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="in-progress">
                  {inProgressTasksList.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Você não tem tarefas em progresso.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inProgressTasksList.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                              )}
                              {task.dueDate && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                            <div>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority === 'high' ? 'Alta' :
                                task.priority === 'medium' ? 'Média' : 'Baixa'}
                              </span>
                            </div>
                          </div>
                          <div className="flex mt-4 space-x-2">
                            <Link href={`/dashboard/tasks/${task.id}`}>
                              <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="done">
                  {doneTasksList.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      Você não tem tarefas concluídas.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {doneTasksList.map((task) => (
                        <div key={task.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                              )}
                              {task.dueDate && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                            <div>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority === 'high' ? 'Alta' :
                                task.priority === 'medium' ? 'Média' : 'Baixa'}
                              </span>
                            </div>
                          </div>
                          <div className="flex mt-4 space-x-2">
                            <Link href={`/dashboard/tasks/${task.id}`}>
                              <Button variant="outline" size="sm">Ver Detalhes</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
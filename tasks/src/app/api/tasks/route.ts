import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { z } from "zod";

// Esquema de validação para criação de tarefas
const createTaskSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    // Verificar se o usuário está autenticado
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validar os dados da requisição
    const validationResult = createTaskSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, status, priority, dueDate } = validationResult.data;

    // Inserir a tarefa no banco de dados
    const result = await db.insert(tasks).values({
      title,
      description,
      status,
      priority,
      userId: session.user.id,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    return NextResponse.json(
      { message: "Tarefa criada com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    // Verificar se o usuário está autenticado
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Buscar todas as tarefas do usuário autenticado
    const userTasks = await db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.userId, session.user.id),
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
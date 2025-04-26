import { api } from './axios';
import { Idea, StatusIdea, TechnologyName } from '../../../backend/src/common/types';

interface ApiIdea {
  id: number;
  name: string;
  problem: string;
  solution: string;
  result: string;
  resource: string;
  stack: string[];
  status: string;
  createdAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  category?: string;
  deadline?: string;
}

const transformIdea = (idea: ApiIdea): Idea => ({
  ...idea,
  stack: idea.stack as TechnologyName[],
  status: idea.status as StatusIdea,
  createdAt: new Date(idea.createdAt),
  deadline: idea.deadline || undefined, // Убираем преобразование в Date, так как ожидается string
  customer: {
    id: idea.customer.id,
    name: idea.customer.name,
    email: idea.customer.email
  },
  category: idea.category
});

export const IdeaApi = {
  async createIdea(ideaData: {
    name: string;
    problem: string;
    solution?: string;
    result?: string;
    resource?: string;
    stack?: string[];
    category?: string;
  }): Promise<Idea> {
    const response = await api.post<ApiIdea>('/ideas', ideaData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return transformIdea(response.data);
  },

  async getAllIdeas(): Promise<Idea[]> {
    const response = await api.get<ApiIdea[]>('/ideas');
    return response.data.map(transformIdea);
  }
};

// Явно экспортируем тип для IdeaApi
export type IdeaApiType = typeof IdeaApi;
import OpenAI from 'openai';

export class AIService {
  constructor(private readonly openAI: OpenAI) {}

  async findFilmTitle(title: string | null, description: string | null): Promise<string> {
    const response = await this.openAI.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Ты - поисковая система фильмов, твоя задача по названию и описанию заметки о фильме найти название фильма. Не пиши ничего кроме названия фильма',
        },
        { role: 'user', content: `Название заметки: ${title}. Описание заметки: ${description}` },
      ],
    });
    if (!response.choices[0].message.content) throw new Error('Fail AI film title find');

    return response.choices[0].message.content;
  }
}

import { getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: RequestDTO): Promise<Transaction> {
    const categoryRepository = getCustomRepository(CategoriesRepository);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      const finalValue = balance.total - value;

      if (finalValue < 0) {
        throw new AppError("Sorry, you don't have balance for this outcome.");
      }
    }

    const category = await categoryRepository.findOneOrCreate({
      title: category_title,
    });

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

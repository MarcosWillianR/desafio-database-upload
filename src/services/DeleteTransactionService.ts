import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id_transaction: string;
}

class DeleteTransactionService {
  public async execute({ id_transaction }: RequestDTO): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.findOne(id_transaction);

    if (!transaction) {
      throw new AppError('Transaction not found');
    }

    await transactionRepository.delete(transaction.id);
  }
}

export default DeleteTransactionService;

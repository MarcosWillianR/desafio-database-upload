import fs from 'fs';
import { join } from 'path';
import { getCustomRepository } from 'typeorm';
import csv from 'csvtojson';

import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

import multerConfig from '../configs/multer';

interface RequestDTO {
  file_information: Express.Multer.File;
}

interface TransactionFile {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ file_information }: RequestDTO): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getCustomRepository(CategoriesRepository);

    const csvFilePath = join(multerConfig.directory, file_information.filename);

    const transactionsCSV: TransactionFile[] = await csv().fromFile(
      csvFilePath,
    );

    const categories = Array.from(
      new Set(transactionsCSV.map(transaction => transaction.category)),
    );

    const createdCategories = await Promise.all(
      categories.map(category =>
        categoryRepository.findOneOrCreate({ title: category }),
      ),
    );

    const transactions = await Promise.all(
      transactionsCSV.map(async transaction => {
        const { title, type, value, category: category_title } = transaction;

        const category_id = createdCategories.find(
          category => category.title === category_title,
        )?.id;

        const transactionInstance = transactionRepository.create({
          title,
          type,
          value,
          category_id,
        });

        await transactionRepository.save(transactionInstance);

        return transactionInstance;
      }),
    );

    const fileCSVExists = await fs.promises.stat(csvFilePath);

    if (fileCSVExists) {
      fs.promises.unlink(csvFilePath);
    }

    return transactions;
  }
}

export default ImportTransactionsService;

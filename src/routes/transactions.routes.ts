import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import multer from 'multer';
import multerConfig from '../configs/multer';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer(multerConfig);

transactionsRouter.get('/', async (req, res) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find({
    relations: ['category'],
  });
  const balance = await transactionRepository.getBalance();

  return res.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (req, res) => {
  const { title, value, type, category } = req.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category_title: category,
  });

  return res.json(transaction);
});

transactionsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ id_transaction: id });

  return res.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (req, res) => {
  const { file } = req;

  const importTransaction = new ImportTransactionsService();

  const transactions = await importTransaction.execute({
    file_information: file,
  });

  return res.json({
    transactions,
  });
});

export default transactionsRouter;

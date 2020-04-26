import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class CreateForeignKeyInTransactionTable1587403112942
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'transactionForeignKeyToCategories',
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        columnNames: ['category_id'],
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropForeignKey(
      'transactions',
      'transactionForeignKeyToCategories',
    );
  }
}

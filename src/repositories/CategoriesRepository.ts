import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface CategoryFields {
  title: string;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findOneOrCreate({ title }: CategoryFields): Promise<Category> {
    let category: Category;

    const findCategory = await this.findOne({
      where: {
        title,
      },
    });

    if (findCategory) {
      category = findCategory;
    } else {
      const newCategory = this.create({
        title,
      });

      await this.save(newCategory);

      category = newCategory;
    }

    return category;
  }
}

export default CategoriesRepository;

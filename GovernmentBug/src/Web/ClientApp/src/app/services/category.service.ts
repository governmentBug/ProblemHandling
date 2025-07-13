import { Injectable } from '@angular/core';
import { Category } from '../models/category.module';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(public CategoryServer: HttpClient) { }
  public selectedCategory: Category | null = null;


    getAllCategory(): Observable<Array<Category>> {
      const createUrl: string = "https://localhost:5001/api/Category";
      return this.CategoryServer.get<Array<Category>>(createUrl); 
    }
}

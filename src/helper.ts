export interface getCarListInterface {
  input: string;
  brand: string;
  model: string;
  transmission: 'mehanika' | 'avtomat';
  sortByPrice: boolean;
}

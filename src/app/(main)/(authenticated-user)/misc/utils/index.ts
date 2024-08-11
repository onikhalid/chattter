import { OrderByDirection } from "firebase/firestore";

export function getOrderFieldAndDirection(query:string){
    let orderByField = 'created_at';
    let orderDirection: OrderByDirection  = 'desc';

    switch (query) {
        case 'date_asc':
          orderByField = 'created_at';
          orderDirection = 'asc';
          break;
        case 'alpha_asc':
          orderByField = 'title';
          orderDirection = 'asc';
          break;
        case 'alpha_desc':
          orderByField = 'title';
          orderDirection = 'desc';
          break;
        case 'name_asc':
          orderByField = 'name';
          orderDirection = 'asc';
          break;
        case 'name_desc':
          orderByField = 'name';
          orderDirection = 'desc';
          break;
        case 'likes_desc':
          orderByField = 'likes';
          orderDirection = 'desc';
          break;
        case 'likes_asc':
          orderByField = 'likes';
          orderDirection = 'asc';
          break;
        default:
          orderByField = 'created_at';
          orderDirection = 'desc';
      }

    return {orderByField, orderDirection};
}
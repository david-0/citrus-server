import {IBeforeUpdate} from "../controllers/IBeforeInterface";
import {Article} from "../models/Article";

export class ArticleProjector implements IBeforeUpdate<Article> {
  public beforeUpdate(instance: Article) {
    if (instance.unitOfMeasurement && instance.unitOfMeasurement.id) {
      instance.unitOfMeasurementId = instance.unitOfMeasurement.id;
    }
  }
}

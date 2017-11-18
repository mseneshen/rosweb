import { WidgetInterface } from '../interface/widget';

export class WidgetParent implements WidgetInterface {
  public widgetInstanceId: number;
  public selector: string;
  public serializedData: any;

  constructor(widgetInstanceId: number, serializedData: any) {
    this.widgetInstanceId = widgetInstanceId;
    this.serializedData = serializedData;
    this.setSelector();
  }

  public clbkCreated(): void {
  }

  public clbkResized(): void {
  }

  public clbkMoved(): void {
  }

  public clbkTab(): void {
  }

  public setSelector(): void {
    this.selector = ".jsWidgetContainer[data-widget-instance-id=" + this.widgetInstanceId + "]";
  }
}
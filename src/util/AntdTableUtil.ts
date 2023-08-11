import type { AntdTableColumn } from "@/model/antd/AntdTableColumn";
import type { i18nModel } from "@/translation/i18n";

export class AntdTableUtil{

  /**
   * helper method to create (Column Model) for AntdTable (a-table).
   * @param fieldList field name of a model (could be virtual)
   * @param i18n PreferenceStore.i18n
   * @param i18nPack "pack" for calling "i18n.t()"
   * @param overrider for each column model created, this call back 
   * is called to allow customizing.
   * @returns 
   */
  static buildTableColoumns(fieldList: string[], 
    i18n: i18nModel, i18nPack: string,
    overrider?: (it: AntdTableColumn)=>AntdTableColumn,
  ): AntdTableColumn[]
  {
    let columns: AntdTableColumn[] =[];
    for (let colName of fieldList) {
      let col: AntdTableColumn = {
        dataIndex: colName,
        title: i18n.t(i18nPack, `field.${colName}`),
      };
      if (overrider) {
        overrider(col);
      }
      columns.push(col);
    }
    return columns;
  }

}

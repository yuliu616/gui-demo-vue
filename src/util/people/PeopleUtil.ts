import { Gender } from "@/model/people/Gender.enum";
import type { People } from "@/model/people/People";
import type { i18nModel } from "@/translation/i18n";
import { StringUtil } from "../StringUtil";

export class PeopleUtil {

  /**
   * get a simple string presentation to describe this 
   * record (like 'Mr. chan').
   * @returns null if no any suitable string
   */
  public static stringPresentationFor(people: People, i18n: i18nModel): string|null {
    if (!people) {
      return null;
    } else if (people.nickname) {
      return people.nickname;
    } else {
      if (people.gender == Gender.MALE) {
        return StringUtil.formatString(
          i18n.people.message['sentence.mr_x'],
          people.firstName,
        );
      } else if (people.gender == Gender.FEMALE) {
        return StringUtil.formatString(
          i18n.people.message['sentence.ms_x'],
          people.firstName,
        );
      } else {
        return people.firstName || null;
      }
    }
  }

}

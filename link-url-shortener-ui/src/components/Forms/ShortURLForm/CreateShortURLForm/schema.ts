import * as yup from "yup";

const domainRegexExpression: any =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const aliasRegexExpression: any = /^(\d|\w|-|_)+$/;

export const createShortURLFormSchema = yup.object().shape(
  {
    originalURL: yup
      .string()
      .lowercase()
      .required()
      .test("Invalid domain", "Invalid domain", (val: any) => {
        const regex = new RegExp(domainRegexExpression);
        return val?.match(regex);
      }),
    alias: yup
      .string()
      .lowercase()
      .when("alias", (val) => {
        if (val?.trim().length > 0) {
          return yup
            .string()
            .min(5, "A minimum of 5 characters must be given")
            .test("Invalid alias", "Invalid alias", (val: any) => {
              const regex = new RegExp(aliasRegexExpression);
              return val?.trim().match(regex);
            });
        } else {
          return yup.string().notRequired();
        }
      }),
    user: yup.string(),
  },
  [["alias", "alias"]] //Cyclic dependency fix
);

import { validationActionsConfig, FormValidationsFieldsIds, getInitialValidationValuesByConfig, checkFormValidity } from "@/utils/constants/constants";

export default {
  data() {
    return {
      values: {},
      errors: {},
      isValid: false,
    };
  },
  methods: {
    handleChange(event) {
      const target = event.target;
      const name = target.name;
      const value = target.value;

      const currentForm = target.closest("form");

      if (!currentForm) {
        return;
      }

      this.values = { ...this.values, [name]: value };

      if (name === FormValidationsFieldsIds.CONFIRM_PASSWORD) {
        this.errors = {
          ...this.errors,
          [name]: value !== this.values[FormValidationsFieldsIds.PASSWORD],
        };

        return;
      }

      this.errors = {
        ...this.errors,
        [name]: !validationActionsConfig[name](value) && !!value,
      };
    },
    clearForm() {
      this.values = {};
      this.errors = {};
      this.isValid = false;
    },
  },
  created() {
    this.values = getInitialValidationValuesByConfig(this.validationConfig.idList);
  },
  watch: {
    values: {
      handler(newValues) {
        this.isValid = checkFormValidity(newValues, this.errors);
      },
      deep: true,
    },
    errors: {
      handler(newErrors) {
        this.isValid = checkFormValidity(this.values, newErrors);
      },
      deep: true,
    },
  },
};

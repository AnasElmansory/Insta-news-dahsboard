<template>
  <v-dialog max-width="600" v-model="showDialog">
    <template v-slot:activator="{ on }" v-if="showDialogWithFabBtn">
      <v-btn fab fixed bottom right dark v-on="on">
        <v-icon>mdi-plus-box</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-form id="form" v-model="valid" ref="form">
        <v-container v-for="(field, index) in formFields" :key="index">
          <v-text-field
            outlined
            color="success"
            v-if="isTextField(index)"
            :append-icon="showSearchIcon(index)"
            :rules="formFields[index].rules"
            :value="formFields[index].value"
            :disabled="isReadOnly(index)"
            :readonly="isReadOnly(index)"
            :placeholder="formFields[index].name"
            @input="onInput($event, index)"
            @keydown.enter="onSubmitField(index)"
            @click:append="onSubmitField(index)"
          >
          </v-text-field>
          <v-container id="list-field-container" v-else>
            <v-text-field
              outlined
              color="warning"
              v-model="listFieldValue"
              :append-icon="showSearchIcon(index)"
              :rules="formFields[index].rules"
              :placeholder="formFields[index].name"
              @keydown.enter="emitAddItem(index)"
              @click:append="emitAddItem(index)"
            ></v-text-field>
            <v-chip-group column v-if="isForNotification">
              <v-chip
                close
                v-for="(keyword, index) in formFields[index].value"
                :key="index"
                @click:close="removeItem(keyword)"
              >
                {{ keyword }}
              </v-chip>
            </v-chip-group>
            <v-chip-group column v-else>
              <v-chip
                close
                v-for="(source, index) in formFields[index].value"
                :key="index"
                @click:close="removeItem(source.id)"
              >
                {{ source.name }}
              </v-chip>
            </v-chip-group>
          </v-container>
        </v-container>

        <v-row justify="center" no-gutters>
          <v-btn
            class="action-button"
            color="error"
            v-show="this.isMobile || false"
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn class="action-button" color="error" @click="reset"
            >Reset</v-btn
          >
          <v-btn class="action-button" :color="buttonColor" @click="onSubmit">{{
            buttonText
          }}</v-btn>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>


<script lang='ts'>
import { Vue, Component, Prop, VModel } from 'nuxt-property-decorator'
import { FormFields } from '~/lib/types'

@Component({})
export default class Dialog extends Vue {
  @VModel({ default: false }) showDialog!: boolean
  @Prop({ required: true }) formFields!: FormFields[]
  @Prop() event!: string
  @Prop() modelType!: string

  valid: boolean = false

  listFieldValue: string = ''

  $refs!: {
    form: any
  }

  get isForNotification(): boolean {
    if (this.modelType === 'Notification') {
      return true
    } else {
      return false
    }
  }

  get buttonColor(): string {
    if (this.event === 'Add') {
      return 'success'
    } else {
      return 'warning'
    }
  }

  get buttonText() {
    return this.event + ' ' + this.modelType
  }
  get showDialogWithFabBtn(): boolean {
    if (this.event === 'Add') {
      return true
    } else {
      return false
    }
  }

  isReadOnly(index: number): boolean {
    if (this.formFields[index].type.includes('read-only')) {
      return true
    } else {
      return false
    }
  }

  showSearchIcon(index: number): string {
    if (this.formFields[index].type.includes('-search')) {
      return 'mdi-magnify'
    } else {
      return ''
    }
  }

  isTextField(index: number): boolean {
    return this.formFields[index].type.includes('text-field')
  }

  onInput(value: string, index: number) {
    this.$emit(`on-input`, value, index)
  }

  onSubmitField(index: number) {
    this.$emit('on-submit-field', this.formFields[index].value)
  }
  removeItem(item: string) {
    this.$emit('remove-item', item)
  }

  emitAddItem(index: number) {
    this.$emit('list-field-add', this.listFieldValue, index)
  }
  onSubmit() {
    if (this.$refs.form.validate()) {
      this.$emit('dialogSubmit')
    }
  }

  reset() {
    this.$refs.form.reset()
  }
  closeDialog() {
    this.showDialog = false
  }
}
</script>

<style scoped>
.container {
  user-select: none;
  padding: 8px;
  padding-bottom: 0px;
}
#list-field-container {
  padding: 0px;
}
.action-button {
  margin: 8px;
}
#form {
  padding: 8px;
}
</style>
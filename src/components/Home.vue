<template>
  <div class="Home">
    <h1 class="Home__title">
      Writing exercises
    </h1>

    <h3 class="Home__categoriesTitle">Select a level of difficulty</h3>
    <ul class="Home__categoriesList">
      <li class="Home__category"
          v-for="(diff, index) in difficulties"
          :key="index">
        <router-link :to="{ name: 'Test' }">
          {{ diff.label }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const difficulties = [{
    label: 'HSK 1 level',
    value: 'easy'
  }, {
    label: 'HSK 2 level',
    value: 'medium'
  }]
</script>

<style scoped lang="scss">

  .Home {

    &__categoriesList {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: calc(100% - 12px);
      padding: 0;
    }

    &__category {
      list-style: none;
      //max-width: 360px;
      margin-bottom: 24px;
      width: 80%;

      a {
        text-decoration: none;
        padding: 24px 0;
        display: inline-block;
        color: whitesmoke;
        position: relative;
        background-color: #42b983;
        width: 100%;
        font-size: 24px;
        font-weight: bold;

        &::after {
          content: '';
          display: block;
          background-color: inherit;
          width: 24px;
          height: 100%;
          position: absolute;
          top: 0;
          right: -12px;
          transform: skew(-17deg);
        }

        &:hover {
          background-color: #2AA05E;
        }
      }
    }
  }

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>

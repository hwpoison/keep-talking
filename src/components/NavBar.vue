<template>
  <nav
    id="nav-bar"
    class="w-full z-10 bg-cyan-600 rounded-br border-b-4 border-cyan-700 h-20 text-white shadow-md select-none"
    :class="{
      'rounded-bl border-l-0': !showBackButton,
    }"
    style="top: 0px; overscroll-behavior: none"
  >
    <div class="flex">
      <div
        id="back-button"
        v-if="showBackButton"
        class="mt-1 transition duration-100 hover:-translate-x-1 pt-2 cursor-pointer"
        @click="goBack()"
      >
        <svg
          class="mt-4 ml-1 fill-current transition"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
        </svg>
      </div>
      <div style="white-space: nowrap" class="h-20 grid grid-cols-1 w-full place-content-between">
        <div class="grid grid-rows-1 grid-cols-2">
          <!-- view title -->
          <slot name="navbar-title" />
          <div class="self-center justify-self-end">
            <!-- menu content at the top right -->
            <slot name="navbar-content" />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { navigation } from "../services/navigation";

const props = withDefaults(defineProps<{
  showBackButton?: boolean;
}>(), {
  showBackButton: false
});

const router = useRouter();

const goBack = (): void => {
  if (props.showBackButton) {
    navigation.clearActiveContact();
  }
  router.replace("/");
};
</script>

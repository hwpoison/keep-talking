<template>
  <li class="pr-2" :title="title">
    <slot name="icon"></slot>
  </li>
  <slot></slot>
  <span v-if="shortcut" style="font-size:12px" class="invisible md:visible">({{ shortcut }})</span>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  shortcut?: string;
}>();
</script>

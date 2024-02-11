<script lang="ts">
  import { page } from '$app/stores';
</script>

<body>
  <style>
    .center1 {
      max-width: 258px;
      max-height: 50px;
      margin-left: auto;
      margin-right: auto;
    }

    .div {
      margin-top: -50px;
      margin-left: -125px;
      position: fixed;
      top: 50%;
      left: 50%;
    }
  </style>

  <h1 class="div" style="font-size:30px;">
    {$page.status}: {$page.error?.message} <img alt="" src="/images/error.png" width="50" height="50" />
  </h1>
</body>

const input = document.querySelector("#pokemonInput");
const button = document.querySelector("#searchBtn");
const card = document.querySelector("#pokemonCard");
const loading = document.querySelector("#loading");
const errorText = document.querySelector("#error");
const toggleDark = document.querySelector("#toggleDark");

toggleDark.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

button.addEventListener("click", fetchPokemon);


button.addEventListener("click", fetchPokemon);

async function fetchPokemon() {
  const pokemonName = input.value.trim().toLowerCase();
  if (!pokemonName) return;

  card.innerHTML = "";
  errorText.textContent = "";
  card.classList.add("hidden");

  loading.classList.remove("hidden");
  button.disabled = true;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Pokémon not found.");
      } else {
        throw new Error("Something went wrong.");
      }
    }

    const data = await response.json();
    displayPokemon(data);

  } catch (error) {
    errorText.textContent = error.message;
  } finally {
    loading.classList.add("hidden");
    button.disabled = false;
  }
}
function displayPokemon(data) {
  const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const id = `#${data.id.toString().padStart(3, "0")}`;
  const height = (data.height / 10).toFixed(1);
  const weight = (data.weight / 10).toFixed(1);
  const baseExp = data.base_experience;

  const types = data.types.map(type => `
    <span class="px-2 py-1 bg-indigo-100 dark:bg-indigo-600 dark:text-white rounded-full text-sm">
      ${type.type.name}
    </span>
  `).join("");

   card.innerHTML = `
    <div class="animate-fadeIn">
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">${name} ${id}</h2>

      <div class="flex justify-center gap-4 my-4">
        <img src="${data.sprites.front_default}" class="w-20 hover:scale-110 transition">
        <img src="${data.sprites.back_default}" class="w-20 hover:scale-110 transition">
        <img src="${data.sprites.front_shiny}" class="w-20 hover:scale-110 transition">
      </div>

      <p class="text-gray-600 dark:text-gray-300">Height: ${height} m</p>
      <p class="text-gray-600 dark:text-gray-300">Weight: ${weight} kg</p>
      <p class="text-gray-600 dark:text-gray-300">Base XP: ${baseExp}</p>

      <div class="flex justify-center gap-2 mt-3">
        ${types}
      </div>
    </div>
  `;

  card.classList.remove("hidden");

}
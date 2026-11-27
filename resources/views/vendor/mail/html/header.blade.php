@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block; text-decoration: none;">
<img src="{{ rtrim(config('app.url'), '/') }}/image/ShopnestLogo.png"
     class="logo"
     width="44"
     height="44"
     alt="{{ config('app.name') }}">
</a>
</td>
</tr>

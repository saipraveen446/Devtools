import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ColorRequest(BaseModel):
    color: Optional[str] = None
    generate: Optional[bool] = False
    count: Optional[int] = 5
    palette: Optional[str] = None
    base_color: Optional[str] = "#3498db"

@router.post("/generate")
def color_generate(request: ColorRequest):
    """Generate colors and convert between formats"""
    data = {
        'color': request.color,
        'generate': request.generate,
        'count': request.count,
        'palette': request.palette,
        'base_color': request.base_color
    }
    return color_generator(data)

def color_generator(data):
    """
    Generate colors and convert between different color formats
    """
    result = {}
    
    if 'generate' in data:
        # Generate random colors
        count = data.get('count', 5)
        colors = []
        
        for _ in range(count):
            r = random.randint(0, 255)
            g = random.randint(0, 255)
            b = random.randint(0, 255)
            
            hex_color = f"#{r:02x}{g:02x}{b:02x}"
            rgb_color = f"rgb({r}, {g}, {b})"
            hsl = rgb_to_hsl(r, g, b)
            
            colors.append({
                'hex': hex_color,
                'rgb': rgb_color,
                'hsl': f"hsl({hsl[0]}, {hsl[1]}%, {hsl[2]}%)",
                'r': r,
                'g': g,
                'b': b
            })
        
        result['generated_colors'] = colors
    
    if 'color' in data:
        # Convert color to different formats
        color_input = data['color'].strip()
        
        if color_input.startswith('#'):
            # Hex color
            hex_color = color_input.lstrip('#')
            if len(hex_color) == 3:
                hex_color = ''.join([c*2 for c in hex_color])
            r = int(hex_color[0:2], 16)
            g = int(hex_color[2:4], 16)
            b = int(hex_color[4:6], 16)
        elif color_input.startswith('rgb'):
            # RGB color
            rgb_values = color_input.replace('rgb(', '').replace(')', '').split(',')
            r, g, b = [int(val.strip()) for val in rgb_values]
        elif color_input.startswith('hsl'):
            # HSL color
            hsl_values = color_input.replace('hsl(', '').replace(')', '').replace('%', '').split(',')
            h, s, l = [float(val.strip()) for val in hsl_values]
            r, g, b = hsl_to_rgb(h, s, l)
        else:
            result['error'] = "Invalid color format. Use hex (#RRGGBB), rgb(r,g,b), or hsl(h,s%,l%)"
            return result
        
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        rgb_color = f"rgb({r}, {g}, {b})"
        hsl = rgb_to_hsl(r, g, b)
        
        result['color_conversion'] = {
            'input': color_input,
            'hex': hex_color,
            'rgb': rgb_color,
            'hsl': f"hsl({hsl[0]}, {hsl[1]}%, {hsl[2]}%)",
            'r': r,
            'g': g,
            'b': b,
            'h': hsl[0],
            's': hsl[1],
            'l': hsl[2]
        }
    
    # Generate color palettes
    if 'palette' in data:
        palette_type = data['palette']
        base_color = data.get('base_color', '#3498db')
        
        if palette_type == 'complementary':
            colors = generate_complementary_palette(base_color)
        elif palette_type == 'analogous':
            colors = generate_analogous_palette(base_color)
        elif palette_type == 'triadic':
            colors = generate_triadic_palette(base_color)
        elif palette_type == 'monochromatic':
            colors = generate_monochromatic_palette(base_color)
        else:
            colors = []
        
        result['palette'] = {
            'type': palette_type,
            'base_color': base_color,
            'colors': colors
        }
    
    return result

def rgb_to_hsl(r, g, b):
    r /= 255
    g /= 255
    b /= 255
    
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    l = (max_val + min_val) / 2
    
    if max_val == min_val:
        h = s = 0
    else:
        d = max_val - min_val
        s = d / (2 - max_val - min_val) if l > 0.5 else d / (max_val + min_val)
        
        if max_val == r:
            h = ((g - b) / d + (6 if g < b else 0)) / 6
        elif max_val == g:
            h = ((b - r) / d + 2) / 6
        else:
            h = ((r - g) / d + 4) / 6
    
    return [int(h * 360), int(s * 100), int(l * 100)]

def hsl_to_rgb(h, s, l):
    h /= 360
    s /= 100
    l /= 100
    
    if s == 0:
        r = g = b = l
    else:
        def hue_to_rgb(p, q, t):
            if t < 0: t += 1
            if t > 1: t -= 1
            if t < 1/6: return p + (q - p) * 6 * t
            if t < 1/2: return q
            if t < 2/3: return p + (q - p) * (2/3 - t) * 6
            return p
        
        q = l * (1 + s) if l < 0.5 else l + s - l * s
        p = 2 * l - q
        r = hue_to_rgb(p, q, h + 1/3)
        g = hue_to_rgb(p, q, h)
        b = hue_to_rgb(p, q, h - 1/3)
    
    return [int(r * 255), int(g * 255), int(b * 255)]

def generate_complementary_palette(base_color):
    hex_color = base_color.lstrip('#')
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    
    # Complementary color
    comp_r = 255 - r
    comp_g = 255 - g
    comp_b = 255 - b
    
    return [
        f"#{r:02x}{g:02x}{b:02x}",
        f"#{comp_r:02x}{comp_g:02x}{comp_b:02x}"
    ]

def generate_analogous_palette(base_color):
    hex_color = base_color.lstrip('#')
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    
    h, s, l = rgb_to_hsl(r, g, b)
    
    colors = []
    for offset in [-30, -15, 0, 15, 30]:
        new_h = (h + offset) % 360
        new_r, new_g, new_b = hsl_to_rgb(new_h, s, l)
        colors.append(f"#{new_r:02x}{new_g:02x}{new_b:02x}")
    
    return colors

def generate_triadic_palette(base_color):
    hex_color = base_color.lstrip('#')
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    
    h, s, l = rgb_to_hsl(r, g, b)
    
    colors = []
    for offset in [0, 120, 240]:
        new_h = (h + offset) % 360
        new_r, new_g, new_b = hsl_to_rgb(new_h, s, l)
        colors.append(f"#{new_r:02x}{new_g:02x}{new_b:02x}")
    
    return colors

def generate_monochromatic_palette(base_color):
    hex_color = base_color.lstrip('#')
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    
    h, s, l = rgb_to_hsl(r, g, b)
    
    colors = []
    for lightness in [20, 35, 50, 65, 80]:
        new_r, new_g, new_b = hsl_to_rgb(h, s, lightness)
        colors.append(f"#{new_r:02x}{new_g:02x}{new_b:02x}")
    
    return colors

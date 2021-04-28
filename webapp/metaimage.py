import io
import os
import requests
import textwrap
import flask
from flask import Response
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw


def share_meta_image():
    static_folder = "static/files/"
    title = "Ubuntu rules"
    title = flask.request.args.get("title", "")
    overlay_image = "meta_image_blank.jpg"
    # overlay_image = flask.request.args.get("overlay_image", "")

    # wrap text
    wrapper = textwrap.TextWrapper(width=20)
    word_list = wrapper.wrap(text=title)
    title_new = ""
    for ii in word_list[:-1]:
        title_new = title_new + ii + "\n"
    title_new += word_list[-1]

    img = Image.open(str(os.path.join(static_folder, overlay_image)))
    draw = ImageDraw.Draw(img)
    # font = ImageFont.truetype(<font-file>, <font-size>)
    font = ImageFont.truetype(
        str(os.path.join(static_folder, "Ubuntu-L.ttf")), 36
    )
    # draw.text((x, y),"Sample Text",(r,g,b))
    draw.text((48, 48), title_new, (255, 255, 255), font=font)
    buffer = io.BytesIO()
    img.save(buffer, optimize=True, quality=50, format="PNG")
    return Response(buffer.getvalue(), mimetype="image/png")

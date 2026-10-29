from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle, PageBreak


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "ROTEIROS-COMERCIAIS.pdf"
FONT = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Arial", str(FONT / "arial.ttf")))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(FONT / "arialbd.ttf")))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleIA", parent=styles["Title"], fontName="Arial-Bold", fontSize=20, leading=24, textColor=colors.HexColor("#172554"), alignment=TA_CENTER, spaceAfter=10))
styles.add(ParagraphStyle(name="H1IA", parent=styles["Heading1"], fontName="Arial-Bold", fontSize=15, leading=19, textColor=colors.HexColor("#92400e"), spaceBefore=10, spaceAfter=6))
styles.add(ParagraphStyle(name="H2IA", parent=styles["Heading2"], fontName="Arial-Bold", fontSize=11, leading=14, textColor=colors.HexColor("#1e3a8a"), spaceBefore=7, spaceAfter=3))
styles.add(ParagraphStyle(name="BodyIA", parent=styles["BodyText"], fontName="Arial", fontSize=9.5, leading=13, spaceAfter=5))
styles.add(ParagraphStyle(name="SmallIA", parent=styles["BodyText"], fontName="Arial", fontSize=8, leading=10, textColor=colors.HexColor("#475569"), spaceAfter=3))
styles.add(ParagraphStyle(name="QuoteIA", parent=styles["BodyText"], fontName="Arial", fontSize=10, leading=14, leftIndent=10, textColor=colors.HexColor("#334155"), borderColor=colors.HexColor("#f59e0b"), borderWidth=1, borderPadding=6, spaceAfter=6))


def P(text, style="BodyIA"):
    return Paragraph(text, styles[style])


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Arial", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(18 * mm, 12 * mm, "Verbo Norte - Roteiros comerciais")
    canvas.drawRightString(192 * mm, 12 * mm, f"Página {doc.page}")
    canvas.restoreState()


story = [
    P("Roteiros comerciais - Verbo Norte", "TitleIA"),
    P("Material de apoio para gravação de vídeos comerciais em redes sociais.", "SmallIA"),
    P("Orientação de produção", "H1IA"),
    P("Crie um vídeo-mestre vertical em <b>1080 x 1920 px, proporção 9:16, MP4/H.264, 30 fps e 15 segundos</b>. Esse formato atende Reels e TikTok. Mantenha textos e legendas longe das áreas ocupadas por botões e informações da plataforma.", "BodyIA"),
]

data = [
    [P("Uso", "SmallIA"), P("Arquivo recomendado", "SmallIA"), P("Ajuste", "SmallIA")],
    [P("Instagram Reels"), P("1080 x 1920, 9:16, 15 s"), P("Texto centralizado e fora das áreas de interface")],
    [P("Facebook Reels"), P("1080 x 1920, 9:16, 15 s"), P("Usar CTA 'Saiba mais'")],
    [P("Instagram/Facebook Feed"), P("1080 x 1350, 4:5, 15 s"), P("Reenquadrar sem esticar o vídeo")],
    [P("TikTok"), P("1080 x 1920, 9:16, 15 s"), P("Gancho nos primeiros 3 s e legenda")],
]
table = Table(data, colWidths=[38 * mm, 52 * mm, 88 * mm], repeatRows=1)
table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#fef3c7")),
    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#cbd5e1")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story += [table, Spacer(1, 5 * mm), P("Roteiro-mestre - 15 segundos", "H1IA")]

scenes = [
    ("0-3 s - Gancho", "Bíblia aberta e tela do sistema entrando no painel.<br/><b>Texto:</b> Prepare melhor. Em menos tempo.<br/><b>Locução:</b> Você ainda começa cada pregação do zero?"),
    ("3-7 s - Benefício principal", "Mostrar a geração de um esboço de pregação.<br/><b>Texto:</b> Pregações estruturadas + exegese.<br/><b>Locução:</b> Com o Verbo Norte, organize pregações e explore o contexto do versículo."),
    ("7-11 s - Diferencial EBD", "Mostrar a tela EBD selecionando PDF ou imagem da revista.<br/><b>Texto:</b> EBD a partir da sua revista.<br/><b>Locução:</b> Use PDF ou imagem como referência para preparar sua aula de EBD."),
    ("11-13 s - Ecossistema", "Mostrar alternância entre caderno, Bíblia e biblioteca.<br/><b>Texto:</b> Estudos, Bíblia e materiais em um só lugar.<br/><b>Locução:</b> Guarde seus estudos e acesse seus recursos em um só lugar."),
    ("13-15 s - CTA", "Mostrar planos mensal e anual e o logo.<br/><b>Texto:</b> Conheça o Verbo Norte - link na bio.<br/><b>Locução:</b> Conheça o Verbo Norte. Revise o conteúdo e use a IA como apoio ao seu ministério."),
]
for title, body in scenes:
    story += [P(title, "H2IA"), P(body)]

story += [
    PageBreak(),
    P("Adaptações por rede", "H1IA"),
    P("Instagram Reels e Facebook Reels", "H2IA"),
    P("Use o vídeo-mestre 9:16. Deixe o nome Verbo Norte e a frase principal no centro da tela. CTA sugerido: <b>Saiba mais</b> ou <b>Link na bio</b>.", "BodyIA"),
    P("Instagram e Facebook Feed", "H2IA"),
    P("Exporte a versão 4:5 em 1080 x 1350 px. Reenquadre a gravação para manter o painel e as legendas visíveis. Não corte o texto do CTA.", "BodyIA"),
    P("TikTok", "H2IA"),
    P("Use o vídeo 9:16. Comece diretamente com a pergunta do gancho, evite uma abertura longa com o logo e mantenha a locução clara. Inclua legenda embutida e CTA final.", "BodyIA"),
    P("Texto para legenda", "H1IA"),
    P("Ferramentas de apoio para pregações, EBD e estudos bíblicos. Conteúdo gerado por IA exige revisão. Conheça o Verbo Norte pelo link da bio.", "QuoteIA"),
    P("Mensagem para WhatsApp", "H1IA"),
    P("Olá! Estamos apresentando o Verbo Norte, uma ferramenta de apoio para preparar pregações, aulas de EBD e estudos bíblicos. Há plano mensal e anual pelo checkout oficial. Se quiser conhecer, acesse o link oficial.", "QuoteIA"),
    P("Checklist antes de publicar", "H1IA"),
    P("• Conferir preço, periodicidade e link do checkout.<br/>• Não prometer acesso antes da confirmação do pagamento.<br/>• Não exibir chaves, tokens ou dados de clientes.<br/>• Usar somente imagens e músicas autorizadas.<br/>• Manter política de privacidade, termos e aviso de IA acessíveis.", "BodyIA"),
]

doc = SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=16 * mm, bottomMargin=20 * mm, title="Roteiros comerciais - Verbo Norte", author="Verbo Norte")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)

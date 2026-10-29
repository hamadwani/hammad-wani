from html import escape
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable

OUTPUT = Path(__file__).resolve().parents[1] / 'public' / 'resume-hammad-wani.pdf'
BG = colors.HexColor('#090909')
WHITE = colors.HexColor('#F1F1ED')
MUTED = colors.HexColor('#B0B0AA')
RULE = colors.HexColor('#454545')
CHIP = colors.HexColor('#171717')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Name', fontName='Helvetica-Bold', fontSize=28, leading=30, textColor=WHITE, spaceAfter=3, uppercase=True))
styles.add(ParagraphStyle(name='Role', fontName='Helvetica', fontSize=11, leading=14, textColor=MUTED, spaceAfter=11))
styles.add(ParagraphStyle(name='Contact', fontName='Courier', fontSize=7.1, leading=10, textColor=MUTED, spaceAfter=2))
styles.add(ParagraphStyle(name='Section', fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=WHITE, spaceBefore=7, spaceAfter=6))
styles.add(ParagraphStyle(name='BodyResume', fontName='Helvetica', fontSize=8.2, leading=11.2, textColor=MUTED, spaceAfter=4))
styles.add(ParagraphStyle(name='EntryTitle', fontName='Helvetica-Bold', fontSize=9.2, leading=12, textColor=WHITE, spaceAfter=2))
styles.add(ParagraphStyle(name='EntryMeta', fontName='Courier', fontSize=6.7, leading=9, textColor=colors.HexColor('#969690'), spaceAfter=2))
styles.add(ParagraphStyle(name='Tag', fontName='Courier', fontSize=6.2, leading=8, textColor=MUTED))
styles.add(ParagraphStyle(name='Small', fontName='Helvetica', fontSize=7.6, leading=10, textColor=MUTED, spaceAfter=3))


def P(text, style='BodyResume'):
    return Paragraph(text, styles[style])


def section(title, content):
    return [P(escape(title.upper()), 'Section'), HRFlowable(width='100%', thickness=.45, color=RULE, spaceBefore=0, spaceAfter=5)] + content


def entry(title, meta, description, tags=()):
    flow = [P(escape(title), 'EntryTitle'), P(escape(meta.upper()), 'EntryMeta'), P(escape(description), 'Small')]
    if tags:
        pills = ' &nbsp; '.join(f'<font backColor="#171717">&nbsp;{escape(tag.upper())}&nbsp;</font>' for tag in tags)
        flow.append(P(pills, 'Tag'))
    return flow


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(.45)
    canvas.line(doc.leftMargin, 18*mm, A4[0]-doc.rightMargin, 18*mm)
    canvas.setFillColor(colors.HexColor('#85857F'))
    canvas.setFont('Courier', 6.5)
    canvas.drawString(doc.leftMargin, 12.5*mm, 'HAMMAD WANI  /  COMPUTER SCIENCE · AI / ML')
    canvas.drawRightString(A4[0]-doc.rightMargin, 12.5*mm, f'{doc.page:02d}')
    canvas.restoreState()


class ResumeDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(str(filename), pagesize=A4, leftMargin=17*mm, rightMargin=17*mm, topMargin=14*mm, bottomMargin=24*mm, title='Hammad Wani - Resume', author='Hammad Wani')
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id='main', leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates([PageTemplate(id='resume', frames=[frame], onPage=draw_page)])


header = [
    P('HAMMAD WANI', 'Name'),
    P('Computer Science and Engineering Student  ·  AI / ML Developer', 'Role'),
    P('hamadwani885@gmail.com  ·  Srinagar, Jammu and Kashmir, India', 'Contact'),
    P('github.com/hamadwani  ·  linkedin.com/in/hamad-wani-6a7a7b335', 'Contact'),
    Spacer(1, 9),
]
left = []
left += section('Profile', [P('Computer Science and Engineering student at the University of Kashmir, interested in Artificial Intelligence, Machine Learning, Computer Vision, and software development. Builds practical technology for real-world problems, especially healthcare and data-driven applications.')])
left += section('Experience', [entry('Web Development Intern', 'Code Alpha  ·  Three-month internship', 'Worked on web development projects using HTML, CSS, and JavaScript.', ['HTML', 'CSS', 'JavaScript'])])
left += section('Education', [entry('Computer Science and Engineering', 'University of Kashmir  ·  Undergraduate student', 'Srinagar, Jammu and Kashmir, India.')])
left += section('Selected Projects', [
    entry('MCI Progression Research', 'Final-year academic research', 'Studies whether MRI, PET, and clinical information can classify progression from MCI to Alzheimer’s dementia within three years versus stable outcomes.', ['MRI', 'PET', 'Clinical data']),
    entry('Law Mitra AI', 'AI and legal technology', 'An AI-focused legal technology project intended to make legal information and assistance more accessible.', ['JavaScript']),
    entry('X-Ray Diagnosis AI', 'Healthcare AI and computer vision', 'Chest X-ray research app using DenseNet121 transfer learning, Grad-CAM, a Flask REST API, and a web interface. Not for clinical diagnosis.', ['Python', 'DenseNet121', 'Grad-CAM']),
    entry('University Management Information System', 'Education technology', 'Web application for student records, enrollment, staff, hostels, placements, scholarships, and exam results.', ['Flask', 'Python', 'SQLite']),
    entry('Personal Book Library', 'Web development', 'Responsive front-end book library with title search and a sample collection.', ['HTML', 'CSS', 'JavaScript']),
])
right = []
right += section('Skills', [P('Programming', 'EntryTitle'), P('Python · Java · C', 'Small'), P('AI / MACHINE LEARNING', 'EntryTitle'), P('Machine learning · Deep learning · Computer vision · Transfer learning', 'Small'), P('Frameworks and tools', 'EntryTitle'), P('TensorFlow · Keras · Flask · Pandas · Scikit-learn', 'Small'), P('Development', 'EntryTitle'), P('Web development · Python scripting · Dataset analysis · Model integration', 'Small')])
right += section('Interests', [P('Healthcare AI, medical image analysis, applied AI research, useful software products, and data-driven applications.')])
right += section('Contact', [P('EMAIL', 'EntryTitle'), P('hamadwani885@gmail.com', 'Small'), P('GITHUB', 'EntryTitle'), P('github.com/hamadwani', 'Small'), P('LINKEDIN', 'EntryTitle'), P('linkedin.com/in/hamad-wani-6a7a7b335', 'Small')])
body = Table([[left, right]], colWidths=[108*mm, 67*mm], hAlign='LEFT', splitInRow=1)
body.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'), ('LEFTPADDING',(0,0),(-1,-1),0), ('RIGHTPADDING',(0,0),(0,0),8*mm), ('LEFTPADDING',(1,0),(1,0),5*mm), ('RIGHTPADDING',(1,0),(1,0),0), ('LINEBEFORE',(1,0),(1,0),.45,RULE)]))
ResumeDoc(OUTPUT).build(header + [body])
print(OUTPUT)

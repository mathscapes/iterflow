all: iterflow-v1.pdf

iterflow-v1.pdf: paper.tex paper.bib
	pdflatex -interaction=nonstopmode paper.tex
	bibtex paper
	pdflatex -interaction=nonstopmode paper.tex
	pdflatex -interaction=nonstopmode paper.tex
	cp paper.pdf iterflow-v1.pdf

clean:
	rm -f paper.aux paper.bbl paper.blg paper.log paper.out paper.pdf

.PHONY: all clean

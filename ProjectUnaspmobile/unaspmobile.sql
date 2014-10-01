-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Máquina: localhost
-- Data de Criação: 01-Out-2014 às 10:42
-- Versão do servidor: 5.6.12-log
-- versão do PHP: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de Dados: `unaspmobile`
--
CREATE DATABASE IF NOT EXISTS `unaspmobile` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `unaspmobile`;

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAnoMes`(IN `ra` INT)
    NO SQL
SELECT financeiro.idano,nome_ano,financeiro.idmes,nome_mes
FROM financeiro 
INNER JOIN ano AS ano ON ano.idano = financeiro.idano and financeiro.idAluno = ra
INNER JOIN mes  AS mes ON mes.idmes = financeiro.idmes$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getAulas`(IN `ra` INT, IN `curso` INT, IN `turma` INT, IN `periodo` INT, IN `disciplina` INT)
    NO SQL
select data,descricao,presenca,falta from aulas where
idAluno = ra and
idCurso = curso and 
idTurma = turma and 
idPeriodo = periodo and 
idDisciplina = disciplina

order by 'data'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getCurso`(IN `ra` INT)
    NO SQL
select Curso.idCurso,Curso.nome from Curso inner join Matricula on 
Matricula.idAluno = ra and Curso.idCurso = Matricula.idCurso$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getDisciplina`(IN `ra` INT, IN `curso` INT, IN `turma` INT, IN `periodo` INT)
    NO SQL
select Disciplina.idDisciplina, Disciplina.nome from Disciplina
inner join Matricula on Matricula.idAluno = ra and Disciplina.idDisciplina = 
Matricula.idDisciplina
and Matricula.idCurso = curso
and Matricula.idTurma = turma
and Matricula.idPeriodo = periodo$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getEmprestimo`(IN `ra` INT)
    NO SQL
select idAluno,tipo,autor,titulo,ano,assunto,editora,serie,foto,
DATE_FORMAT( `data_saida` , '%d/%m/%Y' ) AS `data_saida`,
DATE_FORMAT( `data_devolucao` , '%d/%m/%Y' ) AS `data_devolucao`
from emprestimo inner join material on 
material.idmaterial = emprestimo.idmaterial and
emprestimo.idAluno = ra$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getFinanceiroAno`(IN `ra` INT, IN `ano_valor` INT)
    NO SQL
SELECT idfinaceiro,nome_ano,nome_mes,idAluno,valor, status, DATE_FORMAT(vencimento,'%d/%m/%Y') as vencimento 
FROM financeiro 
INNER JOIN ano AS ano ON ano.idano = ano_valor and financeiro.idAluno = ra
INNER JOIN mes  AS mes ON mes.idmes = financeiro.idmes$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getMaterial`(IN `nome_art` VARCHAR(250))
    NO SQL
SELECT idmaterial,tipo,autor,titulo,ano,assunto,editora,serie,disponivel,foto, DATE_FORMAT( `data` , '%d/%c/%Y' ) AS `data` FROM `material` WHERE
autor LIKE CONCAT('%',SUBSTRING(nome_art,1,3),'%') or
titulo LIKE CONCAT('%',SUBSTRING(nome_art,1,3),'%') or
assunto LIKE CONCAT('%',SUBSTRING(nome_art,1,3),'%') or
editora LIKE CONCAT('%',SUBSTRING(nome_art,1,3),'%')$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getNotas`(IN `ra` INT, IN `curso` INT, IN `turma` INT, IN `periodo` INT, IN `disciplina` INT)
    NO SQL
SELECT idNotas,data,titulo,nota,peso,professor.nome,matricula.status, 
DATE_FORMAT( `data` , '%d/%m/%Y' ) AS `data`
from notas 
inner join professor on
notas.idProfessor = professor.idProfessor and
idAluno = ra and 
idCurso = curso and 
idTurma = turma and
idPeriodo = periodo and 
idDisciplina = disciplina
inner join matricula on matricula.idAluno = ra
ORDER BY  `data`$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getPeriodo`(IN `ra` INT, IN `curso` INT, IN `turma` INT)
    NO SQL
select Periodo.idPeriodo,Periodo.nome from Periodo inner join Matricula
on Matricula.idAluno = ra and Periodo.idPeriodo = Matricula.idPeriodo
and Matricula.idCurso = curso and Matricula.idTurma = turma$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getReserva`(IN `ra` INT)
    NO SQL
select idAluno,tipo,autor,titulo,ano,assunto,editora,serie,foto
from reserva inner join material on 
material.idmaterial = reserva.idmaterial and
reserva.idAluno = ra$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getTurma`(IN `ra` INT, IN `curso` INT)
    NO SQL
select Turma.idTurma,Turma.nome from Turma inner join Matricula on 
Matricula.idAluno = ra and Turma.idTurma = Matricula.idTurma
and Matricula.idCurso = curso$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `login`(IN `ra` INT, IN `senha_valor` VARCHAR(45))
    NO SQL
SELECT idAluno, nome,senha FROM aluno WHERE idAluno = ra and senha = senha_valor$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `selectReserva`(IN `ra` INT)
    NO SQL
SELECT material.idmaterial,tipo,autor,titulo,ano,assunto,editora,serie,foto,

idreserva,idAluno FROM material 

INNER JOIN reserva on reserva.idmaterial = material.idmaterial

WHERE idAluno = ra$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `setEmprestimo`(IN `ra` INT, IN `material` INT, IN `data` DATE)
    NO SQL
INSERT INTO `emprestimo`(`idemprestimo`, `data_saida`, `data_devolucao`, `idmaterial`, `idAluno`) VALUES 
(NULL,CURRENT_TIMESTAMP,data,material,ra)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `setReserva`(IN `ra` INT, IN `material` INT)
    NO SQL
INSERT INTO `unaspmobile`.`reserva` (`idreserva`, `idAluno`, `idmaterial`) VALUES (NULL, ra, material)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura da tabela `aluno`
--

CREATE TABLE IF NOT EXISTS `aluno` (
  `idAluno` int(11) NOT NULL,
  `nome` varchar(45) DEFAULT NULL,
  `senha` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idAluno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `aluno`
--

INSERT INTO `aluno` (`idAluno`, `nome`, `senha`) VALUES
(86539, 'Jonas Padilha', 'popup'),
(98653, 'Leandro Quadros', 'popup');

-- --------------------------------------------------------

--
-- Estrutura da tabela `ano`
--

CREATE TABLE IF NOT EXISTS `ano` (
  `idano` int(11) NOT NULL AUTO_INCREMENT,
  `nome_ano` int(11) NOT NULL,
  PRIMARY KEY (`idano`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=16 ;

--
-- Extraindo dados da tabela `ano`
--

INSERT INTO `ano` (`idano`, `nome_ano`) VALUES
(1, 2000),
(2, 2001),
(3, 2002),
(4, 2003),
(5, 2004),
(6, 2005),
(7, 2006),
(8, 2007),
(9, 2008),
(10, 2009),
(11, 2010),
(12, 2011),
(13, 2012),
(14, 2013),
(15, 2014);

-- --------------------------------------------------------

--
-- Estrutura da tabela `aulas`
--

CREATE TABLE IF NOT EXISTS `aulas` (
  `idAulas` int(11) NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `descricao` varchar(250) COLLATE utf8_bin DEFAULT NULL,
  `presenca` varchar(2) COLLATE utf8_bin DEFAULT NULL,
  `falta` varchar(2) COLLATE utf8_bin DEFAULT NULL,
  `idAluno` int(11) NOT NULL,
  `idCurso` int(11) NOT NULL,
  `idTurma` int(11) NOT NULL,
  `idPeriodo` int(11) NOT NULL,
  `idDisciplina` int(11) NOT NULL,
  `idProfessor` int(11) NOT NULL,
  PRIMARY KEY (`idAulas`),
  KEY `fk_aulas_turma1_idx` (`idTurma`),
  KEY `fk_aulas_disciplina1_idx` (`idDisciplina`),
  KEY `fk_aulas_professor1_idx` (`idProfessor`),
  KEY `fk_aulas_curso1_idx` (`idCurso`),
  KEY `fk_aulas_aluno1_idx` (`idAluno`),
  KEY `fk_aulas_periodo1_idx` (`idPeriodo`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `aulas`
--

INSERT INTO `aulas` (`idAulas`, `data`, `descricao`, `presenca`, `falta`, `idAluno`, `idCurso`, `idTurma`, `idPeriodo`, `idDisciplina`, `idProfessor`) VALUES
(1, '2014-07-16', 'Atividades', 'p', NULL, 86539, 21, 4, 4, 5, 14),
(2, '2014-07-24', 'Atividades', NULL, 'F', 98653, 22, 4, 5, 6, 15);

-- --------------------------------------------------------

--
-- Estrutura da tabela `curso`
--

CREATE TABLE IF NOT EXISTS `curso` (
  `idCurso` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idCurso`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=23 ;

--
-- Extraindo dados da tabela `curso`
--

INSERT INTO `curso` (`idCurso`, `nome`) VALUES
(21, 'Ciência da Computação'),
(22, 'Pedagogia');

-- --------------------------------------------------------

--
-- Estrutura da tabela `disciplina`
--

CREATE TABLE IF NOT EXISTS `disciplina` (
  `idDisciplina` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `idProfessor` int(11) NOT NULL,
  PRIMARY KEY (`idDisciplina`),
  KEY `fk_Disciplina_Professor1_idx` (`idProfessor`),
  KEY `idDisciplina` (`idDisciplina`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Extraindo dados da tabela `disciplina`
--

INSERT INTO `disciplina` (`idDisciplina`, `nome`, `idProfessor`) VALUES
(5, 'Introdução ao Direito', 14),
(6, 'Matemática', 15);

-- --------------------------------------------------------

--
-- Estrutura da tabela `emprestimo`
--

CREATE TABLE IF NOT EXISTS `emprestimo` (
  `idemprestimo` int(11) NOT NULL AUTO_INCREMENT,
  `data_saida` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_devolucao` date NOT NULL,
  `idmaterial` int(11) NOT NULL,
  `idAluno` int(11) NOT NULL,
  PRIMARY KEY (`idemprestimo`),
  KEY `fk_emprestimo_material1_idx` (`idmaterial`),
  KEY `fk_emprestimo_aluno1_idx` (`idAluno`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=4 ;

--
-- Extraindo dados da tabela `emprestimo`
--

INSERT INTO `emprestimo` (`idemprestimo`, `data_saida`, `data_devolucao`, `idmaterial`, `idAluno`) VALUES
(1, '2014-08-11 22:55:53', '2014-12-12', 2, 86539),
(2, '2014-08-12 04:17:08', '2014-12-12', 2, 86539),
(3, '2014-08-15 12:59:01', '2014-12-12', 2, 86539);

-- --------------------------------------------------------

--
-- Estrutura da tabela `financeiro`
--

CREATE TABLE IF NOT EXISTS `financeiro` (
  `idfinaceiro` int(11) NOT NULL AUTO_INCREMENT,
  `idano` int(11) NOT NULL,
  `idmes` int(11) NOT NULL,
  `idAluno` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `vencimento` date NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idfinaceiro`),
  KEY `fk_financeiro_aluno1_idx` (`idAluno`),
  KEY `fk_financeiro_mes1_idx` (`idmes`),
  KEY `fk_financeiro_ano1_idx` (`idano`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=13 ;

--
-- Extraindo dados da tabela `financeiro`
--

INSERT INTO `financeiro` (`idfinaceiro`, `idano`, `idmes`, `idAluno`, `valor`, `vencimento`, `status`) VALUES
(1, 15, 1, 86539, '804.00', '2014-01-10', 0),
(2, 15, 2, 86539, '804.00', '2014-02-10', 0),
(3, 15, 3, 86539, '804.00', '2014-03-10', 0),
(4, 15, 4, 86539, '804.00', '2014-04-10', 0),
(5, 15, 5, 86539, '804.00', '2014-05-10', 0),
(6, 15, 6, 86539, '804.00', '2014-06-10', 0),
(7, 15, 7, 86539, '804.00', '2014-07-10', 0),
(8, 15, 8, 86539, '804.00', '2014-08-10', 0),
(9, 15, 9, 86539, '804.00', '2014-09-10', 0),
(10, 15, 10, 86539, '804.00', '2014-10-10', 0),
(11, 15, 11, 86539, '804.00', '2014-11-10', 0),
(12, 15, 12, 86539, '804.00', '2014-12-10', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `material`
--

CREATE TABLE IF NOT EXISTS `material` (
  `idmaterial` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(250) COLLATE utf8_bin NOT NULL,
  `autor` varchar(250) COLLATE utf8_bin NOT NULL,
  `titulo` varchar(250) COLLATE utf8_bin NOT NULL,
  `ano` varchar(250) COLLATE utf8_bin NOT NULL,
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `assunto` varchar(250) COLLATE utf8_bin NOT NULL,
  `editora` varchar(250) COLLATE utf8_bin NOT NULL,
  `serie` varchar(250) COLLATE utf8_bin NOT NULL,
  `quantidade` int(11) NOT NULL,
  `disponivel` int(11) DEFAULT '0',
  `foto` varchar(500) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`idmaterial`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `material`
--

INSERT INTO `material` (`idmaterial`, `tipo`, `autor`, `titulo`, `ano`, `data`, `assunto`, `editora`, `serie`, `quantidade`, `disponivel`, `foto`) VALUES
(2, 'periodico', 'dfsdaf', 'sadfsadf', '2014', '2014-07-29 00:17:28', 'asfsdf', 'sadfdf', 'sdfsdf', 12, 0, '4de611f2e6d6938516d343736fcdb5fe.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `matricula`
--

CREATE TABLE IF NOT EXISTS `matricula` (
  `idAluno` int(11) NOT NULL,
  `idPeriodo` int(11) NOT NULL,
  `idCurso` int(11) NOT NULL,
  `idTurma` int(11) NOT NULL,
  `idDisciplina` int(11) NOT NULL,
  `status` int(2) DEFAULT NULL,
  `idMatricula` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`idMatricula`),
  KEY `fk_Matricula_Aluno_idx` (`idAluno`),
  KEY `fk_Matricula_Periodo1_idx` (`idPeriodo`),
  KEY `fk_Matricula_Curso1_idx` (`idCurso`),
  KEY `fk_Matricula_Turma1_idx` (`idTurma`),
  KEY `fk_Matricula_Disciplina1_idx` (`idDisciplina`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Extraindo dados da tabela `matricula`
--

INSERT INTO `matricula` (`idAluno`, `idPeriodo`, `idCurso`, `idTurma`, `idDisciplina`, `status`, `idMatricula`) VALUES
(86539, 4, 21, 4, 5, NULL, 1),
(98653, 5, 22, 4, 6, NULL, 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `mes`
--

CREATE TABLE IF NOT EXISTS `mes` (
  `idmes` int(11) NOT NULL AUTO_INCREMENT,
  `nome_mes` varchar(250) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`idmes`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=13 ;

--
-- Extraindo dados da tabela `mes`
--

INSERT INTO `mes` (`idmes`, `nome_mes`) VALUES
(1, 'Janeiro'),
(2, 'Fevereiro'),
(3, 'Março'),
(4, 'Abril'),
(5, 'Maio'),
(6, 'Junho'),
(7, 'Julho'),
(8, 'Agosto'),
(9, 'Setembro'),
(10, 'Outubro'),
(11, 'Novembro'),
(12, 'Dezembro');

-- --------------------------------------------------------

--
-- Estrutura da tabela `notas`
--

CREATE TABLE IF NOT EXISTS `notas` (
  `idNotas` int(11) NOT NULL AUTO_INCREMENT,
  `data` date DEFAULT NULL,
  `titulo` varchar(45) DEFAULT NULL,
  `nota` double DEFAULT NULL,
  `idTurma` int(11) NOT NULL,
  `idProfessor` int(11) NOT NULL,
  `idDisciplina` int(11) NOT NULL,
  `idCurso` int(11) NOT NULL,
  `idAluno` int(11) NOT NULL,
  `idPeriodo` int(11) NOT NULL,
  `peso` int(5) NOT NULL,
  PRIMARY KEY (`idNotas`),
  KEY `fk_Notas_Turma1_idx` (`idTurma`),
  KEY `fk_Notas_Professor1_idx` (`idProfessor`),
  KEY `fk_Notas_Disciplina1_idx` (`idDisciplina`),
  KEY `fk_Notas_Curso1_idx` (`idCurso`),
  KEY `fk_Notas_Aluno1_idx` (`idAluno`),
  KEY `fk_Notas_Periodo1_idx` (`idPeriodo`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Extraindo dados da tabela `notas`
--

INSERT INTO `notas` (`idNotas`, `data`, `titulo`, `nota`, `idTurma`, `idProfessor`, `idDisciplina`, `idCurso`, `idAluno`, `idPeriodo`, `peso`) VALUES
(2, '2014-07-08', 'P1', 10, 4, 14, 5, 21, 86539, 4, 2),
(3, '2014-07-10', 'P2', 5, 4, 15, 6, 22, 98653, 7, 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `periodo`
--

CREATE TABLE IF NOT EXISTS `periodo` (
  `idPeriodo` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idPeriodo`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Extraindo dados da tabela `periodo`
--

INSERT INTO `periodo` (`idPeriodo`, `nome`) VALUES
(4, '1° Semestre'),
(5, '2º Semestre'),
(6, '3º Semestre'),
(7, '4º Semestre'),
(8, '5º Semestre'),
(9, '6º Semestre'),
(10, '7º Semestre'),
(11, '8º Semestre');

-- --------------------------------------------------------

--
-- Estrutura da tabela `professor`
--

CREATE TABLE IF NOT EXISTS `professor` (
  `idProfessor` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idProfessor`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- Extraindo dados da tabela `professor`
--

INSERT INTO `professor` (`idProfessor`, `nome`) VALUES
(14, 'Lucas'),
(15, 'Pedro');

-- --------------------------------------------------------

--
-- Estrutura da tabela `reserva`
--

CREATE TABLE IF NOT EXISTS `reserva` (
  `idreserva` int(11) NOT NULL AUTO_INCREMENT,
  `idAluno` int(11) NOT NULL,
  `idmaterial` int(11) NOT NULL,
  PRIMARY KEY (`idreserva`),
  KEY `idreserva` (`idreserva`),
  KEY `fk_reserva_aluno1_idx1` (`idAluno`),
  KEY `fk_reserva_material1_idx1` (`idmaterial`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=4 ;

--
-- Extraindo dados da tabela `reserva`
--

INSERT INTO `reserva` (`idreserva`, `idAluno`, `idmaterial`) VALUES
(1, 86539, 2),
(2, 86539, 2),
(3, 86539, 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `turma`
--

CREATE TABLE IF NOT EXISTS `turma` (
  `idTurma` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idTurma`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Extraindo dados da tabela `turma`
--

INSERT INTO `turma` (`idTurma`, `nome`) VALUES
(4, 'C3-900');

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `aulas`
--
ALTER TABLE `aulas`
  ADD CONSTRAINT `fk_aulas_aluno1` FOREIGN KEY (`idAluno`) REFERENCES `aluno` (`idAluno`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aulas_curso1` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`idCurso`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aulas_disciplina1` FOREIGN KEY (`idDisciplina`) REFERENCES `disciplina` (`idDisciplina`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aulas_periodo1` FOREIGN KEY (`idPeriodo`) REFERENCES `periodo` (`idPeriodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aulas_professor1` FOREIGN KEY (`idProfessor`) REFERENCES `professor` (`idProfessor`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_aulas_turma1` FOREIGN KEY (`idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `disciplina`
--
ALTER TABLE `disciplina`
  ADD CONSTRAINT `fk_Disciplina_Professor1` FOREIGN KEY (`idProfessor`) REFERENCES `professor` (`idProfessor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `emprestimo`
--
ALTER TABLE `emprestimo`
  ADD CONSTRAINT `fk_emprestimo_aluno1` FOREIGN KEY (`idAluno`) REFERENCES `aluno` (`idAluno`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_emprestimo_material1` FOREIGN KEY (`idmaterial`) REFERENCES `material` (`idmaterial`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `financeiro`
--
ALTER TABLE `financeiro`
  ADD CONSTRAINT `fk_financeiro_aluno1` FOREIGN KEY (`idAluno`) REFERENCES `aluno` (`idAluno`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_financeiro_ano1` FOREIGN KEY (`idano`) REFERENCES `ano` (`idano`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_financeiro_mes1` FOREIGN KEY (`idmes`) REFERENCES `mes` (`idmes`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `matricula`
--
ALTER TABLE `matricula`
  ADD CONSTRAINT `fk_Matricula_Aluno` FOREIGN KEY (`idAluno`) REFERENCES `aluno` (`idAluno`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Matricula_Curso1` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`idCurso`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Matricula_Disciplina1` FOREIGN KEY (`idDisciplina`) REFERENCES `disciplina` (`idDisciplina`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Matricula_Periodo1` FOREIGN KEY (`idPeriodo`) REFERENCES `periodo` (`idPeriodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Matricula_Turma1` FOREIGN KEY (`idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `notas`
--
ALTER TABLE `notas`
  ADD CONSTRAINT `fk_Notas_Aluno1` FOREIGN KEY (`idAluno`) REFERENCES `aluno` (`idAluno`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Notas_Curso1` FOREIGN KEY (`idCurso`) REFERENCES `curso` (`idCurso`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Notas_Disciplina1` FOREIGN KEY (`idDisciplina`) REFERENCES `disciplina` (`idDisciplina`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Notas_Periodo1` FOREIGN KEY (`idPeriodo`) REFERENCES `periodo` (`idPeriodo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Notas_Professor1` FOREIGN KEY (`idProfessor`) REFERENCES `professor` (`idProfessor`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_Notas_Turma1` FOREIGN KEY (`idTurma`) REFERENCES `turma` (`idTurma`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Limitadores para a tabela `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `fk_reserva_aluno1` FOREIGN KEY (`idAluno`) REFERENCES `aluno` (`idAluno`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reserva_material1` FOREIGN KEY (`idmaterial`) REFERENCES `material` (`idmaterial`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
